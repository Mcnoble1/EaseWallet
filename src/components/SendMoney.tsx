import React, { useEffect, useState, useRef, useContext } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppContext } from '../utils/AppContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filterOfferings, PFIs } from '../utils/helpers';
import { DidDht } from '@web5/dids'
import { PresentationExchange } from "@web5/credentials";
import { useNavigate } from 'react-router-dom';
import { Close, Order, Rfq, TbdexHttpClient } from '@tbdex/http-client'
import Loading from './Loading'
const steps = [
  'Currency Input',
  'See Offerings',
  'Check Credentials',
  'Get Quote',
  'Place Order',
];

// Step Indicator Component
const StepIndicator: React.FC<{ currentStep: number; goToStep: (step: number) => void }> = ({ currentStep, goToStep }) => {
  return (
    <div className="flex items-center lg:mx-40 mb-5">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer ${
              currentStep >= index ? 'border-green' : 'border-gray-300'
            }`}
            onClick={() => goToStep(index)}
          >
            {currentStep > index ? '✔️' : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-px ${
                currentStep > index ? 'bg-green' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Step Components
const CurrencyInputStep: React.FC<{ onNext: () => void; onFetchOfferings: any }> = ({ onNext, onFetchOfferings }) => {
  const [formData, setFormData] = useState<{ payinCurrency: string; payoutCurrency: string }>({
    payinCurrency: '',
    payoutCurrency: '',
  });
  const [loading, setLoading] = useState(false);

  const offeringsData = JSON.parse(localStorage.getItem('offerings') || '{}');
  const payinCurrencyCodes: any[] = [];
  const payoutCurrencyCodes: any[] = [];

  Object.values(offeringsData).forEach((transactions: any) => {
    transactions.forEach((transaction: any) => {
      const { payin, payout } = transaction.data;

      if (!payinCurrencyCodes.includes(payin.currencyCode)) {
        payinCurrencyCodes.push(payin.currencyCode);
      }

      if (!payoutCurrencyCodes.includes(payout.currencyCode)) {
        payoutCurrencyCodes.push(payout.currencyCode);
      }
    });
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchOfferings = async () => {
    if (!formData.payinCurrency || !formData.payoutCurrency) {
      toast.info('Please select both currencies.', { autoClose: 1200 });
      return;
    }
    setLoading(true);
    await onFetchOfferings(formData.payinCurrency, formData.payoutCurrency);
    setLoading(false);
    onNext();
  };

  return (
    <div className='w-[90%] lg:w-[60%]'>
      <h4 className="text-title-sm mb-4 font-semibold text-white"></h4>
      <div className="bg-tertiary w-full rounded-lg p-4 shadow-md">
        <form>
          <div className="flex flex-col gap-5.5">
            <div>
              <label className="mb-2.5 block text-white">Payin Currency</label>
              <select
                name="payinCurrency"
                value={formData.payinCurrency}
                onChange={handleInputChange}
                required
                className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
              >
                <option value="">Select currency</option>
                {payinCurrencyCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2.5 block text-white">Payout Currency</label>
              <select
                name="payoutCurrency"
                value={formData.payoutCurrency}
                onChange={handleInputChange}
                required
                className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
              >
                <option value="">Select currency</option>
                {payoutCurrencyCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchOfferings}
            disabled={loading}
            className="mr-5 mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
          >
            {loading ? <span>Loading...</span> : 'Get Offerings'}
          </button>
        </form>
      </div>
    </div>
  );
};

const OfferingsStep: React.FC<{ offerings: any[]; onNext: () => void; onSelectOffering: (offering: any) => void }> = ({ offerings, onNext, onSelectOffering }) => {
  const handleOfferingClick = (offering: any) => {
    onSelectOffering(offering);
    onNext();
  };

  const [trades, setTrades] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const hoursStr = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    const minutesStr = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
    const secondsStr = remainingSeconds > 0 ? `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}` : '';
  
    // Combine hours, minutes, and seconds into a readable format
    return [hoursStr, minutesStr, secondsStr].filter(Boolean).join(', ');
  }
  
  return (
    <div className='w-[90%]'>
      <h4 className="text-title-sm mb-4 font-semibold text-white">Offerings</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerings?.map((offering, index) => (
          <div key={index} onClick={() => handleOfferingClick(offering)} className="bg-tertiary text-white rounded-lg shadow-md p-3 cursor-pointer hover:bg-opacity-100">
            <div className='flex justify-between'>
              <h5 className="text-md font-semibold mb-2">
                {PFIs.find((pfi) => pfi.did === offering.metadata.from)?.name} 5<span className="text-yellow text">★</span>
              </h5>
              <p className="text-sm mb-2">{offering.data.payin.currencyCode} to {offering.data.payout.currencyCode}</p>
            </div>

            <div className='flex text-sm justify-between'>
              <p>Payin Methods</p>
              <p>{offering.data.payin.methods.map((method: any, methodIndex: number) => (
                  <span
                    key={methodIndex}
                    className="inline-block text-sm"
                  >
                    {method.kind}
                  </span>
                ))}
                </p>
            </div>

            <div className='flex text-sm justify-between'>
              <p>Rate</p>
              <p>1 {offering.data.payin.currencyCode} /{' '}{offering.data.payoutUnitsPerPayinUnit} {offering.data.payout.currencyCode}</p>
            </div>

            <div className='flex text-sm justify-between'>
              <p>Settlement Time</p>
              <p>{formatTime(offering.data.payout.methods[0].estimatedSettlementTime)}</p>
            </div>

            <div className='flex text-sm justify-between'>
              <p>Trades: {trades}</p>
              <p>Completion rate: {completionRate}%</p>
            </div>

          </div>
        ))}
      </div>
    </div>     
  );
};

const KycStep: React.FC<{ selectedOffering: any; onNext: () => void }> = ({ selectedOffering, onNext }) => {
  const credential = localStorage.getItem('credentialJWT');
  const navigate = useNavigate();

  const satisfiesOfferingRequirements = (offering: any, credentials: string[]) => {
    if (credentials.length === 0 || !offering.data.requiredClaims) {
      return false;
    }

    try {
      // Validate customer's VCs against the offering's presentation definition
      PresentationExchange.satisfiesPresentationDefinition({
        vcJwts: credentials,
        presentationDefinition: offering.data.requiredClaims,
      });
      return true;
    } catch (e) {
      return false;
    }
  };

  const kyc = () => {
    const credentials = credential ? [credential] : [];
    const satisfiesRequirements = satisfiesOfferingRequirements(selectedOffering, credentials);

    if (satisfiesRequirements) {
      toast.success("KYC successful! Proceed to request for a Quote");
      // onNext();
    } else {
      toast.error("KYC failed! Complete Verification to proceed");
      navigate('/profile');
    }
  };

  useEffect(() => {
    kyc();
  }, []);


  return (
    <div>
      <h4 className="text-title-sm mb-4 font-semibold text-white">KYC Check</h4>
      <p className="text-white">Performing KYC...</p>
      <button
      onClick={onNext}
      className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
    >
      Proceed
    </button>
    </div>
  );
};

const QuoteStep: React.FC<{ selectedOffering: any; onNext: () => void }> = ({ selectedOffering, onNext }) => {
  const navigate = useNavigate();
  const { userId } = useContext(AppContext);
  // const { transactions, setTransactions } = useTransactionContext();
  const [formData, setFormData] = useState({
    amount: '',
    fee: '',
    payoutDetails: {},
    payinMethod: '',
    payoutMethod: '',
    payinDetails: {},
  });
  const [quoteDetails, setQuoteDetails] = useState([{
    id: '',
    message: [],
    payinAmount: '',
    payinCurrency: '',
    payoutAmount: '',
    payoutCurrency: '',
    status: '',
    exchangeId: '',
    createdTime: '',
    expirationTime: '',
    from: '',
    to: '',
    pfiDid: '',
  }]);
  const [reason, setReason] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const credential = localStorage.getItem('credentialJWT');
  const credentials = credential ? [credential] : [];
  const did = localStorage.getItem('userDid');
  const [payinMethodDetails, setPayinMethodDetails] = useState(null);
  const [payoutDetails, setPayoutDetails] = useState(null);
  const [errors, setErrors] = useState({});

  const createTransaction = useMutation(api.transactions.createTransaction);
  const updateTransaction = useMutation(api.transactions.updateTransaction);
  const transactions = useQuery(api.transactions.getUserTransactions, { userId: userId }); 
  console.log("transactions", transactions);

  const validateField = (name, value) => {
    let error = '';

    // Validation logic
    if (!value) {
      error = 'This field is required';
    } else {
      if (name.includes('Number') || name.includes('amount') || name.includes('sort')) {
        // Validate account number (numbers only)
        if (!/^\d+$/.test(value)) {
          error = `${name} must contain only numbers`;
        }
      } else if (name.includes('address')) {
        // Validate address (letters and numbers only)
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = 'Address must contain only letters and numbers';
        }
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    return error === ''; // Returns true if valid, false if invalid
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let fee = '';

    // Calculate the fee based on the amount (1% fee)
    if (name === 'amount') {
      const amount = parseFloat(value);
      if (!isNaN(amount)) {
        fee = (amount * 0.01).toFixed(2);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      fee,
    }));

    validateField(name, value); // Validate the input on change
  };

  const handlePayinMethodChange = (event) => {
    const selectedMethod = event.target.value;
    const methodDetails = selectedOffering?.data?.payin?.methods.find(method => method.kind === selectedMethod);

    setPayinMethodDetails(methodDetails?.requiredPaymentDetails?.properties ? methodDetails : {});

    setFormData((prevData) => ({
      ...prevData,
      payinMethod: selectedMethod,
      payinDetails: {},
    }));
  };

  const handlePayoutMethodChange = (event) => {
    const selectedMethod = event.target.value;
    const methodDetails = selectedOffering?.data?.payout?.methods.find(method => method.kind === selectedMethod);

    setPayoutDetails(methodDetails?.requiredPaymentDetails?.properties ? methodDetails : {});

    setFormData((prevData) => ({
      ...prevData,
      payoutMethod: selectedMethod,
      payoutDetails: {},
    }));
  };

  const handlePayinDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      payinDetails: {
        ...prevData.payinDetails,
        [name]: value,
      },
    }));

    validateField(name, value); // Validate the input on change
  };

  const handlePayoutDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      payoutDetails: {
        ...prevData.payoutDetails,
        [name]: value,
      },
    }));

    validateField(name, value); // Validate the input on change
  };

  const isFormValid = () => {
    const requiredFields = ['amount', 'payinMethod', 'payoutMethod', ...Object.keys(formData.payinDetails), ...Object.keys(formData.payoutDetails)];
    let valid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field] || formData.payinDetails[field] || formData.payoutDetails[field])) {
        valid = false;
      }
    });

    return valid;
  };

  const requestQuote = async () => {
    if (isFormValid()) {
      setLoading(true);
      const result = await createExchange(selectedOffering, formData.amount, formData.payinMethod, formData.payinDetails, formData.payoutMethod, formData.payoutDetails,);
      const exchanges = await fetchExchanges(selectedOffering.metadata.from)
      setLoading(false);
      setStep(2);
      pollExchanges();
    } else {
      toast.info('Please fill all fields');
    }    
  };

  const handleOrder = () => {
    addOrder(quoteDetails.exchangeId, quoteDetails.pfiDid);
    toast.success('Order placed successfully');
    onNext(); 
  };

  // display the date in words format like August 12, 2024
  const formatDatetime = (datetimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(datetimeString));
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(datetimeString));
    return (`${formattedDate} ${formattedTime}`);
  };


  const handleClose = () => {
      addClose(quoteDetails.exchangeId, quoteDetails.pfiDid, reason);
      setPopupOpen(false);
      toast.success('Exchange closed successfully');
      navigate("/transactions")
  };  

  const createExchange = async (offering, amount, payinMethod, payinPaymentDetails, payoutMethod, payoutPaymentDetails) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    const selectedCredentials = PresentationExchange.selectCredentials({
      vcJwts: credentials,
      presentationDefinition: offering.data.requiredClaims,
    })

    const rfq = Rfq.create({
      metadata: {
        from: userDid?.uri,
        to: offering.metadata.from,
        protocol: '1.0'
      },
      data: {
        offeringId: offering.metadata.id,
        payin: {
          amount: amount.toString(),
          kind: payinMethod,
          paymentDetails: payinPaymentDetails
        },
        payout: {
          kind: payoutMethod,
          paymentDetails: payoutPaymentDetails
        },
        claims: selectedCredentials
      },
    })

    try{
      rfq.verifyOfferingRequirements(offering)
    } catch (e) {
      console.log('Offering requirements not met', e)
    }
    await rfq.sign(userDid)
    try {
      await TbdexHttpClient.createExchange(rfq)
      console.log("creating exchange");
    }
    catch (error) {
      console.error('Failed to create exchange:', error);
    }
  }

  const generateExchangeStatusValues = (exchangeMessage) => {
    if (exchangeMessage instanceof Close) {
      if (exchangeMessage.data.reason?.toLowerCase().includes('complete') || exchangeMessage.data.reason?.toLowerCase().includes('success') ) {
        return 'completed'
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('expired')) {
        return exchangeMessage.data.reason.toLowerCase()
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('cancelled')) {
        return 'cancelled'
      } else {
        return `failed`
      }
    }
    return exchangeMessage.kind
  }

  const formatMessages = (exchanges) => {
    console.log(exchanges)
    const formattedMessages = exchanges.map(exchange => {
        const latestMessage = exchange[exchange.length - 1]
        const rfqMessage = exchange.find(message => message.kind === 'rfq')
        const quoteMessage = exchange.find(message => message.kind === 'quote')
        const orderMessage = exchange.find(message => message.kind === 'order')
        const orderStatusMessage = exchange.find(message => message.kind === 'orderStatus')
        const closeMessage = exchange.find(message => message.kind === 'close')
        const platformFee = formData.fee
        const sender = rfqMessage?.privateData.payin.paymentDetails.accountNumber
        const rfqTime = rfqMessage?.metadata.createdAt
        const quoteTime = quoteMessage?.metadata.createdAt
        const orderTime = orderMessage?.metadata.createdAt
        const closeTime = closeMessage?.metadata.createdAt
        const closeReason = closeMessage?.data.reason
        const orderStatusTime = orderStatusMessage?.metadata.createdAt
        const orderStatus = orderStatusMessage?.data?.orderStatus
        const status = generateExchangeStatusValues(latestMessage)
        const fee = quoteMessage?.data['payin']?.['fee']
        const payinAmount = quoteMessage?.data['payin']?.['amount']
        const payoutPaymentDetails = rfqMessage.privateData?.payout.paymentDetails
        setQuoteDetails({
          message: latestMessage,
          id: latestMessage.metadata.exchangeId,
          payinAmount: (fee ? Number(payinAmount) + Number(fee) + Number(platformFee) : Number(payinAmount)  + Number(platformFee)).toString() || rfqMessage.data['payinAmount'],
          payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
          payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
          payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
          status,
          exchangeId: latestMessage.metadata.exchangeId,
          createdTime: rfqMessage.createdAt,
          ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
          from: sender,
          to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber || " " + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
          pfiDid: rfqMessage.metadata.to
        })
        return {
          // message: latestMessage,
          payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
          payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
          payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
          payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
          status,
          exchangeId: latestMessage.metadata.exchangeId,
          createdTime: rfqMessage.createdAt,
          // ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
          from: sender,
          to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber || " " + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
          rfqTime: rfqTime,
          platformFee: platformFee,
          quoteTime: quoteTime,
          orderTime: orderTime,
          orderStatusTime: orderStatusTime,
          orderStatus: orderStatus,
          closeTime: closeTime,
          pfi: selectedOffering.metadata.from,
          userId: userId,
          closeReason: closeReason
        }
      })

      return formattedMessages;
  }

  const fetchExchanges = async (pfiUri) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    try {
      const exchanges = await TbdexHttpClient.getExchanges({
        pfiDid: pfiUri,
        did: userDid
      });
      const mappedExchanges = formatMessages(exchanges)
      return mappedExchanges
    } catch (error) {
      console.error('Failed to fetch exchanges:', error);
    }
  }

  const addClose = async (exchangeId, pfiUri, reason) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });

    // TODO 9: Create Close message, sign it, and submit it to the PFI
    const close = Close.create({
      metadata: {
        from: userDid.uri,
        to: pfiUri,
        exchangeId,
      },
      data: {
        reason
      }
    })

    await close.sign(userDid)
    try {
      // send Close message
      const response = await TbdexHttpClient.submitClose(close);
      console.log(response);
    }
    catch (error) {
      console.error('Failed to close exchange:', error);
    }
  }

  const addOrder = async (exchangeId, pfiUri) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    // TODO 10: Create Order message, sign it, and submit it to the PFI
    const order = Order.create({
      metadata: {
        from: userDid.uri,
        to: pfiUri,
        exchangeId
      }
    })

    await order.sign(userDid)
    try {
      // Send order message
      const response = await TbdexHttpClient.submitOrder(order);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  const updateExchanges = async (newTransactions) => {

    if (loading || !transactions) {
      console.log('Transactions are still loading or not available.');
    }

    if (!transactions || transactions.length === 0) {
      console.log('No transactions found for this user.');
    }
  
    console.log('Fetched transactions:', transactions);

    console.log("incoming Transaction", newTransactions);

    const existingExchangeIdandTransactionId = transactions?.map(transaction => ({
      _id: transaction._id,
      exchangeId: transaction.exchangeId
    }));
    console.log('Mapped transaction IDs and exchange IDs:', existingExchangeIdandTransactionId);
  
    for (const transaction of newTransactions) {
      const existingTransaction = existingExchangeIdandTransactionId.find(
        (existingTransaction) => existingTransaction.exchangeId === transaction.exchangeId
      );
  
      if (!existingTransaction) {
        // Only create the transaction if exchangeId does not already exist in the database
        console.log('New transaction detected. Creating:', transaction.exchangeId);
        const transactionId = await createTransaction(transaction);
        console.log('Transaction created:', transactionId);
      } else {
        // Update the existing transaction if the exchangeId matches
        const transactionId = existingTransaction._id;
        console.log('Transaction already exists, updating:', transactionId);
  
        const updatedTransaction = await updateTransaction({
          id: transactionId, ...transaction
        });
        console.log('Transaction updated:', updatedTransaction);
      }
    }
  };
  

  const pollExchanges = () => {
    const fetchAllExchanges = async () => {
      console.log('Polling exchanges');
      try {
          const exchanges = await fetchExchanges(selectedOffering.metadata.from);
        updateExchanges(exchanges.reverse());
      } catch (error) {
        console.error('Failed to fetch exchanges:', error);
      }
    };
    fetchAllExchanges();
    setInterval(fetchAllExchanges, 30000);
  };
  
  return (
    <div className='w-[100%] lg:w-[60%]'>
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      {step === 1 && (
        <div className="bg-tertiary w-full rounded-lg p-4 shadow-md">
          <h4 className="text-title-sm font-semibold text-center text-white">Get Quote</h4>
        <form>
        <div className="flex flex-col gap-5.5">
            <div>
              <label className="mb-2.5 block text-white">Amount</label>
              <input
                type='text'
                name="amount" 
                value={formData.amount}
                onChange={handleInputChange}
                placeholder='1000'
                required
                className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
              />
               {errors.amount && <p className="text-danger">{errors.amount}</p>}
            </div>

              <div>
                <label className="mb-2.5 block text-white">Fee (1%)</label>
                <input
                  type="text"
                  name="fee"
                  value={formData.fee}
                  disabled
                  required
                  className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
                />
              </div>

            <div>
              <label className="mb-2.5 block text-white">Payin Method</label>
              <select
                name="payinMethod"
                value={formData.payinMethod}
                onChange={handlePayinMethodChange}
                required
                className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
              >
                <option value="">Select method</option>
                {selectedOffering?.data?.payin?.methods.map((method, index) => (
                  <option key={index} value={method.kind}>
                    {method.kind}
                  </option>
                ))}
              </select>
              {errors.payinMethod && <p className="text-danger">{errors.payinMethod}</p>}
              {payinMethodDetails && Object.keys(payinMethodDetails.requiredPaymentDetails?.properties || {}).length > 0 && (
                  <div className="mt-3">
                    {Object.keys(payinMethodDetails.requiredPaymentDetails.properties).map((key, index) => (
                      <div key={index} className="mt-2">
                        <label className="mb-2.5 block text-white">{payinMethodDetails.requiredPaymentDetails.properties[key].title}</label>
                        <input
                          type="text"
                          name={key}
                          value={formData.payinDetails[key] || ''}
                          onChange={handlePayinDetailsChange}
                          required
                          placeholder='12345678'
                          className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
                        />
                        {errors[key] && <p className="text-danger">{errors[key]}</p>}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div>
              <label className="mb-2.5 block text-white">Payout Method</label>
              <select
                name="payoutMethod"
                value={formData.payoutMethod}
                onChange={handlePayoutMethodChange}
                required
                className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
              >
                <option value="">Select method</option>
                {selectedOffering?.data?.payout?.methods.map((method, index) => (
                  <option key={index} value={method.kind}>
                    {method.kind}
                  </option>
                ))}
              </select>
              {errors.payoutMethod && <p className="text-danger">{errors.payoutMethod}</p>}
              {payoutDetails && Object.keys(payoutDetails.requiredPaymentDetails?.properties || {}).length > 0 && (
                  <div className="mt-3">
                    {Object.keys(payoutDetails.requiredPaymentDetails.properties).map((key, index) => (
                      <div key={index} className="mt-2">
                        <label className="mb-2.5 block text-white">{payoutDetails.requiredPaymentDetails.properties[key].title}</label>
                        <input
                          type="text"
                          name={key}
                          value={formData.payoutDetails[key] || ''}
                          onChange={handlePayoutDetailsChange}
                          required
                          placeholder='0987654'
                          className="w-full text-white rounded-lg border-[1.5px] border-stroke bg-tertiary py-5 px-5 font-medium outline-none"
                        />
                        {errors[key] && <p className="text-danger">{errors[key]}</p>}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <button
            type="button"
            onClick={requestQuote}
            disabled={loading}
            className="mr-5 mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
          >
           Request Quote 
          </button>
          {loading && <Loading />}
        </form>
      </div>
      )}

      {step === 2 && quoteDetails && (
        <div className="bg-tertiary w-full rounded-lg p-4 shadow-md">
          <h4 className="text-title-sm font-semibold text-center text-white">Quote Details</h4>
          <div className="space-y-5 mt-3">
            <div className='flex text-sm justify-between'>
              <p className="text-lg font-semibold">Payin Amount</p>
              <p className="font-medium text-lg text-white">{quoteDetails.payinAmount} {quoteDetails.payinCurrency}</p>
            </div>
            <div className='flex text-sm justify-between'>
              <p className="text-lg font-semibold">Payout Amount</p>
              <p className="font-medium text-white text-lg">{quoteDetails.payoutAmount} {quoteDetails.payoutCurrency}</p>
            </div>
            <div className='flex text-sm justify-between'>
              <p className="text-lg font-semibold">Status</p>
              <p className={`${(quoteDetails.status) === "completed" ? 'bg-green' : 'bg-secondary' } px-2 rounded-2xl font-medium text-white text-lg`}>{quoteDetails.status}</p>
            </div>
            <div className='flex text-sm justify-between'>
              <p className="text-lg font-semibold">Creation Time</p>
              <p className="font-medium text-white text-lg">{formatDatetime(quoteDetails.createdTime)}</p>
            </div>
            <div className='flex text-sm justify-between'>
              <p className="text-lg font-semibold">Expiration Time</p>
              <p className="font-medium text-white text-lg">{formatDatetime(quoteDetails.expirationTime)}</p>
            </div>
            <div className='flex text-sm justify-between'>
              <p className="text-lg font-semibold">Recipient</p>
              <p className="font-medium text-white text-lg">{quoteDetails.to}</p>
            </div>
          </div>
          <div className="mt-5 flex gap-4">
            <button
              onClick={handleOrder}
              className="flex-1 py-2 px-4 bg-green text-white font-semibold rounded-2xl hover:bg-green-600"
            >
              Order
            </button>
            <button
              ref={trigger}
              onClick={() => setPopupOpen(!popupOpen)}
              className="flex-1 py-2 px-4 bg-danger text-white font-semibold rounded-2xl hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
          {popupOpen && (
              <div
                ref={popup}
                className="fixed inset-0 flex items-center text-white justify-center z-50 bg-primary bg-opacity-70"
              >
                <div
                  className="bg-tertiary lg:w-[30%] rounded-lg pt-2 px-6 shadow-md"
                  style={{ maxHeight: 'calc(100vh - 180px)' }}
                >
                  <div className="flex flex-row justify-between">
                    <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">Cancel Exchange</h2>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setPopupOpen(false)} 
                        className="text-blue-500 hover:text-gray-700 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 fill-current bg-white rounded-full p-1 hover:bg-opacity-90"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="black"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <form>
                    <div className="flex flex-col gap-5.5">
                        <div>
                            <label className="mb-2.5 block text-white">Reason</label>
                            <input
                                name="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-tertiary py-3 px-5 font-medium outline-none"
                            >
                            </input>
                        </div>
                    </div> 
                  </form>
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className={`mr-5 mt-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-danger py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="spinner"></div>
                          <span className="pl-1">Closing Exchange</span>
                        </div>
                      ) : (
                        <>Cancel</>
                      )}
                    </button>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  </div>
)};

const OrderStep: React.FC<{ goToStep: (step: number) => void }> = ({ goToStep }) => {
  const navigate = useNavigate();
  const goHome = () => {
  // navigate('/dashboard');
  goToStep(0)
  }

  return (
  <div>
    <h4 className="text-title-sm mb-4 font-semibold text-white">Place Order</h4>
    <p className="text-white mb-2">Your order has been placed successfully.</p>
    <button
      onClick={goHome}
      className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
    >
      Go home
    </button>
  </div>
)};

// Main Component
const SendMoney: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [offerings, setOfferings] = useState<any[]>([]);
const [selectedOffering, setSelectedOffering] = useState<any>(null);

  const handleNextStep = () => {
  setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSelectOffering = (offering: any) => {
    setSelectedOffering(offering);
  };
  
  const fetchOfferings = (payinCurrency: string, payoutCurrency: string) => {
  const filteredOfferings = filterOfferings(payinCurrency, payoutCurrency);
  setOfferings(filteredOfferings);
  if (filteredOfferings.length === 0) {
    toast.info('No offerings found for the selected currencies.', { autoClose: 1500 });
    handlePrevStep();
  } else {
    toast.success(`${filteredOfferings.length === 1 ? `${filteredOfferings.length} offering found!` : `${filteredOfferings.length} offerings found!`}`, { autoClose: 1500 });
  }
};

return (
  <>
    <StepIndicator currentStep={currentStep} goToStep={goToStep}/>
    <div className="flex items-center justify-center w-full">
      {currentStep === 0 && (
        <CurrencyInputStep onNext={handleNextStep} onFetchOfferings={fetchOfferings} />
      )}
      {currentStep === 1 && <OfferingsStep offerings={offerings} onNext={handleNextStep} onSelectOffering={handleSelectOffering}/>}
      {currentStep === 2 && <KycStep selectedOffering={selectedOffering} onNext={handleNextStep} />}
      {currentStep === 3 && <QuoteStep onNext={handleNextStep} selectedOffering={selectedOffering}/>}
      {currentStep === 4 && <OrderStep goToStep={goToStep}/>}
  </div>
  </>
  );
};

export default SendMoney;















