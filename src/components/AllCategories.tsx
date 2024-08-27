import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filterOfferings, PFIs } from '../utils/helpers';
import { DidDht } from '@web5/dids'
import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { useNavigate } from 'react-router-dom';
import { Close, Order, Rfq, TbdexHttpClient } from '@tbdex/http-client'


const steps = [
  'Currency Input',
  'See Offerings',
  'Check Credentials',
  'Get Quote',
  'View Quote',
  'Place Order',
  'Order Completed',
];

// Step Indicator Component
const StepIndicator: React.FC<{ currentStep: number; goToStep: (step: number) => void }> = ({ currentStep, goToStep }) => {
  return (
    <div className="flex items-center mx-40 mb-4">
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
    <div className='w-[60%]'>
      <h4 className="text-title-sm mb-4 font-semibold text-white">Swap Currency</h4>
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
                className="w-full rounded-lg border-[1.5px] border-stroke bg-tertiary py-3 px-5 font-medium outline-none"
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
                className="w-full rounded-lg border-[1.5px] border-stroke bg-tertiary py-3 px-5 font-medium outline-none"
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

  return (
    <div className='w-[80%]'>
      <h4 className="text-title-sm mb-4 font-semibold text-white">Offerings</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerings?.map((offering, index) => (
          <div key={index} onClick={() => handleOfferingClick(offering)} className="bg-tertiary text-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-opacity-80">
            <h5 className="text-lg font-semibold mb-2">
              {PFIs.find((pfi) => pfi.did === offering.metadata.from)?.name}
            </h5>
            <p className="text-md mb-2">{offering.data.description}</p>
            <p>
              <strong>Payin Methods:</strong>{' '}
              {offering.data.payin.methods.map((method: any, methodIndex: number) => (
                <span
                  key={methodIndex}
                  className="inline-block bg-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
                >
                  {method.kind}
                </span>
              ))}
            </p>
            <p>
              <strong>Conversion Rate:</strong> 1 {offering.data.payin.currencyCode} ={' '}
              {offering.data.payoutUnitsPerPayinUnit} {offering.data.payout.currencyCode}
            </p>
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
    useEffect(() => {
    const credentials = credential ? [credential] : [];
    const satisfiesRequirements = satisfiesOfferingRequirements(selectedOffering, credentials);

    if (satisfiesRequirements) {
      toast.success("KYC successful! Proceed to request for a Quote");
    } else {
      toast.error("KYC failed! Complete Verification to proceed");
      navigate('/profile');
    }
  }, []);
  };

  // useEffect(() => {
    kyc(); 
  // }, []); 

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
  const [formData, setFormData] = useState({
    amount: '',
    payoutDetails: '',
    payinMethod: '',
  });
  const [quoteDetails, setQuoteDetails] = useState([{
    id: '',
    payinAmount: '',
    payinCurrency: '',
    payoutAmount: '',
    payoutCurrency: '',
    status: '',
    createdTime: '',
    expirationTime: '',
    from: '',
    to: '',
    pfiDid: '',
  }]);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const credential = localStorage.getItem('credentialJWT');
  const credentials = credential ? [credential] : [];
  const did = localStorage.getItem('userDid');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const requestQuote = async () => {
    setLoading(true);
    // Call getQuote function here with formData details
    const result = await createExchange(selectedOffering, formData.amount, { 
      address: formData.payoutDetails }, formData.payinMethod);
    const exchanges = await fetchExchanges(selectedOffering.metadata.from)
    console.log('Exchanges:', exchanges)
    setLoading(false);
    setStep(2);
  };

  const handleOrder = () => {
    // Call function to place the order
    // addOrder(quoteDetails.id, quoteDetails.pfiDid);
    onNext(); // Proceed to the next step
  };

  // display the date in words format like August 12, 2024
  const formatDatetime = (datetimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(datetimeString));
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(datetimeString));
    return (`${formattedDate} ${formattedTime}`);
  };


  const handleClose = () => {
    if (window.confirm('Are you sure you want to close this quote?')) {
      // Handle close logic here
      // addClose(quoteDetails.id, quoteDetails.pfiDid, 'Cancelled');
      setStep(1); // Return to the initial screen
    }
  };  

  const createExchange = async (offering, amount, payoutPaymentDetails, payinMethod) => {
    // TODO 3: Choose only needed credentials to present using PresentationExchange.selectCredentials
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    const selectedCredentials = PresentationExchange.selectCredentials({
      vcJwts: credentials,
      presentationDefinition: offering.data.requiredClaims,
    })

    console.log(selectedOffering)

    // TODO 4: Create RFQ message to Request for a Quote
    const rfq = Rfq.create({
      metadata: {
        from: userDid?.uri,
        to: offering.metadata.from,
        protocol: '1.0'
      },
      data: {
        offeringId: selectedOffering.metadata.id,
        payin: {
          amount: amount.toString(),
          kind: payinMethod,
          paymentDetails: {
            accountNumber: '1234567890123456',
            routingNumber: '12345',
          }
        },
        payout: {
          kind: offering.data.payout.methods[0].kind,
          paymentDetails: payoutPaymentDetails
        },
        claims: selectedCredentials
      },
    })

    try{
      // TODO 5: Verify offering requirements with RFQ - rfq.verifyOfferingRequirements(offering)
      rfq.verifyOfferingRequirements(offering)
    } catch (e) {
      // handle failed verification
      console.log('Offering requirements not met', e)
    }

    // TODO 6: Sign RFQ message
    await rfq.sign(userDid)

    console.log('RFQ:', rfq)

    try {
      // TODO 7: Submit RFQ message to the PFI .createExchange(rfq)
      await TbdexHttpClient.createExchange(rfq)
    }
    catch (error) {
      console.error('Failed to create exchange:', error);
    }
  }

  // createExchange(selectedOffering, 100, {
  //   address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  // });

  const generateExchangeStatusValues = (exchangeMessage) => {
    if (exchangeMessage instanceof Close) {
      if (exchangeMessage.data.reason?.toLowerCase().includes('complete') || exchangeMessage.data.reason?.toLowerCase().includes('success') ) {
        return 'completed'
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('expired')) {
        return exchangeMessage.data.reason.toLowerCase()
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('cancelled')) {
        return 'cancelled'
      } else {
        return 'failed'
      }
    }
    return exchangeMessage.kind
  }


  const formatMessages = (exchanges) => {
    const formattedMessages = exchanges.map(exchange => {
        const latestMessage = exchange[exchange.length - 1]
        const rfqMessage = exchange.find(message => message.kind === 'rfq')
        const quoteMessage = exchange.find(message => message.kind === 'quote')
        // console.log('quote', quoteMessage)
        const status = generateExchangeStatusValues(latestMessage)
        const fee = quoteMessage?.data['payin']?.['fee']
        const payinAmount = quoteMessage?.data['payin']?.['amount']
        const payoutPaymentDetails = rfqMessage.privateData?.payout.paymentDetails
        setQuoteDetails({ 
          id: latestMessage.metadata.exchangeId,
          payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
          payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
          payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
          payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
          status,
          createdTime: rfqMessage.createdAt,
          ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
          from: 'You',
          to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
          pfiDid: rfqMessage.metadata.to
        })
        return {
          id: latestMessage.metadata.exchangeId,
          payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
          payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
          payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
          payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
          status,
          createdTime: rfqMessage.createdAt,
          ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
          from: 'You',
          to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
          pfiDid: rfqMessage.metadata.to
        }
      })

      return formattedMessages;
  }

  const fetchExchanges = async (pfiUri) => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    try {
      // TODO 8: get exchanges from the PFI
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

  const getQuote = async () => {
    const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
    const exchanges = await fetchExchanges(selectedOffering.metadata.from)
    console.log('Exchanges:', exchanges)
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
      await TbdexHttpClient.submitClose(close)
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
      return await TbdexHttpClient.submitOrder(order)
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  const updateExchanges = (newTransactions) => {
    const existingExchangeIds = transactions.map(tx => tx.id);
    const updatedExchanges = [...transactions];

    newTransactions.forEach(newTx => {
      const existingTxIndex = updatedExchanges.findIndex(tx => tx.id === newTx.id);
      if (existingTxIndex > -1) {
        // Update the existing transaction
        updatedExchanges[existingTxIndex] = newTx;
      } else {
        // Add the new transaction
        updatedExchanges.push(newTx);
      }
    });

    // Sort the transactions if needed
    // updatedTransactions.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

    // Update the state with the new transactions
    setTransactions(updatedExchanges);
  };

  const pollExchanges = () => {
    const fetchAllExchanges = async () => {
      const userDid = await DidDht.import({ portableDid: JSON.parse(did) });
      console.log('Polling exchanges again...');
      if(!userDid) return
      const allExchanges = []
      try {
        for (const pfi of PFIs) {
          const exchanges = await fetchExchanges(selectedOffering.metadata.from);
          allExchanges.push(...exchanges)
        }
        console.log('All exchanges:', allExchanges);
        updateExchanges(allExchanges.reverse());
        setTransactionsLoading(false);  
      } catch (error) {
        console.error('Failed to fetch exchanges:', error);
      }
    };

    // Run the function immediately
    fetchAllExchanges();

    // Set up the interval to run the function periodically
    setInterval(fetchAllExchanges, 5000); // Poll every 5 seconds
  };

  
  return (
  <div>
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      {step === 1 && (
        <div className="space-y-4">
              <h4 className="text-title-sm mt-4 font-semibold text-center text-white">Get Quote</h4>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Amount to Convert</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Select Payin Method</label>
            <select
              name="payinMethod"
              value={formData.payinMethod}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select method</option>
              {selectedOffering?.data?.payin?.methods.map((method, index) => (
                <option key={index} value={method.kind}>
                  {method.kind}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Payout Details</label>
            <input
              type="text"
              name="payoutDetails"
              value={formData.payoutDetails}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={requestQuote}
            disabled={loading}
            className="w-full py-2 px-4 bg-secondary text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-blue-400"
          >
            {loading ? 'Loading...' : 'Request Quote'}
          </button>
        </div>
      )}

      {step === 2 && quoteDetails && (
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white text-center mb-4">Quote Details</h4>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Payin Amount: <span className="font-medium text-white">{quoteDetails.payinAmount}</span></p>
            <p className="text-lg font-semibold">Payout Amount: <span className="font-medium text-white">{quoteDetails.payoutAmount}</span></p>
            <p className="text-lg font-semibold">Payout Currency: <span className="font-medium text-white">{quoteDetails.payoutCurrency}</span></p>
            <p className="text-lg font-semibold">Status: <span className={`${(quoteDetails.status) === "completed" ? 'bg-green' : 'bg-secondary' } px-2 pb-1 rounded-2xl font-medium text-white`}>{quoteDetails.status}</span></p>
            <p className="text-lg font-semibold">Created Time: <span className="font-medium text-white">{formatDatetime(quoteDetails.createdTime)}</span></p>
            <p className="text-lg font-semibold">Expiration Time: <span className="font-medium text-white">{formatDatetime(quoteDetails.expirationTime)}</span></p>
            <p className="text-lg font-semibold">From: <span className="font-medium text-white">{quoteDetails.from}</span></p>
            <p className="text-lg font-semibold">To: <span className="font-medium text-white">{quoteDetails.to}</span></p>

          </div>
          <div className="flex gap-4">
            <button
              onClick={handleOrder}
              className="flex-1 py-2 px-4 bg-green text-white font-semibold rounded-md hover:bg-green-600"
            >
              Order
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-danger text-white font-semibold rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)};

const OrderStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div>
    <h4 className="text-title-sm mb-4 font-semibold text-white">Place Order</h4>
    <p className="text-white">Placing order...</p>
    <button
      onClick={onNext}
      className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
    >
      Proceed
    </button>
  </div>
);

const OrderCompletedStep: React.FC = () => {
  const navigate = useNavigate();
  const goHome = () => {
  navigate('/dashboard');
  }

  return (
  <div>
    <h4 className="text-title-sm mb-4 font-semibold text-white">Order Completed</h4>
    <p className="text-white mb-2">Your order has been completed successfully.</p>
    <button className='p-2 text-white rounded-full bg-secondary' onClick={goHome}>Go home</button>
  </div>
)};

// Main Component
const Convert: React.FC = () => {
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
    toast.success(`${filteredOfferings.length} offerings found!`, { autoClose: 1500 });
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
      {currentStep === 4 && <OrderStep onNext={handleNextStep} />}
      {currentStep === 5 && <OrderCompletedStep />}
  </div>
  </>
  );
};

export default Convert;


