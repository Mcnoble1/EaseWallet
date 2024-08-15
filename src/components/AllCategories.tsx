import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filterOfferings, PFIs } from '../utils/helpers';

const steps = [
  'Currency Input',
  'See Offerings',
  'Check Credentials/KYC',
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
      toast.error('Please select both currencies.', { autoClose: 1200 });
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

const OfferingsStep: React.FC<{ offerings: any[]; onNext: () => void }> = ({ offerings, onNext }) => {
  return (
    <div className='w-[80%]'>
      <h4 className="text-title-sm mb-4 font-semibold text-white">Offerings</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerings?.map((offering, index) => (
          <div key={index} className="bg-tertiary text-white rounded-lg shadow-md p-6">
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
      <button
        onClick={onNext}
        className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
      >
        Proceed
      </button>
    </div>     
  );
};

// Placeholder for other steps
const KycStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
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

const QuoteStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div>
    <h4 className="text-title-sm mb-4 font-semibold text-white">Get Quote</h4>
    <p className="text-white">Fetching quote...</p>
    <button
      onClick={onNext}
      className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
    >
      Proceed
    </button>
  </div>
);

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

const OrderCompletedStep: React.FC = () => (
  <div>
    <h4 className="text-title-sm mb-4 font-semibold text-white">Order Completed</h4>
    <p className="text-white">Your order has been completed successfully.</p>
  </div>
);

// Main Component
const Convert: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [offerings, setOfferings] = useState<any[]>([]);

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
  
  const fetchOfferings = (payinCurrency: string, payoutCurrency: string) => {
  const filteredOfferings = filterOfferings(payinCurrency, payoutCurrency);
  setOfferings(filteredOfferings);
  if (filteredOfferings.length === 0) {
    toast.error('No offerings found for the selected currencies.');
  } else {
    toast.success(`${filteredOfferings.length} offerings found!`);
  }
};

return (
  <>
    <StepIndicator currentStep={currentStep} goToStep={goToStep}/>
  <div className="flex items-center justify-center w-full">
      {currentStep === 0 && (
        <CurrencyInputStep onNext={handleNextStep} onFetchOfferings={fetchOfferings} />
      )}
      {currentStep === 1 && <OfferingsStep offerings={offerings} onNext={handleNextStep} />}
      {currentStep === 2 && <KycStep onNext={handleNextStep} />}
      {currentStep === 3 && <QuoteStep onNext={handleNextStep} />}
      {currentStep === 4 && <OrderStep onNext={handleNextStep} />}
      {currentStep === 5 && <OrderCompletedStep />}
  </div>
  </>
  );
};

export default Convert;


