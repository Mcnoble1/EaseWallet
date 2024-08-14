import React, { useState, ChangeEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filterOfferings, PFIs } from '../utils/helpers';

const Convert: React.FC = () => {
  const [selectedOfferings, setSelectedOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{ payinCurrency: string; payoutCurrency: string }>({
    payinCurrency: '',
    payoutCurrency: '',
  }); 

  let filteredOfferings: any = [];

  const offeringsData = JSON.parse(localStorage.getItem('offerings') || '{}');

  const payinCurrencyCodes: any[] = [];
  const payoutCurrencyCodes: any[] = [];

Object.values(offeringsData).forEach(transactions => {
  transactions.forEach(transaction => {
    const { payin, payout } = transaction.data;
    
    if (!payinCurrencyCodes.includes(payin.currencyCode)) {
      payinCurrencyCodes.push(payin.currencyCode);
    }

    if (!payoutCurrencyCodes.includes(payout.currencyCode)) {
      payoutCurrencyCodes.push(payout.currencyCode);
    }
  });
});

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement> ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };     

  const fetchOfferings = async () => {
    console.log(formData.payinCurrency, formData.payoutCurrency);
    setLoading(true);
    filteredOfferings = filterOfferings(formData.payinCurrency, formData.payoutCurrency);
    setSelectedOfferings(filteredOfferings);
    console.log(filteredOfferings)
    if (filteredOfferings.length === 0) {
      toast.error('No offerings found for the selected currencies.');
    } 
    setLoading(false);
  }


  return (
    <>
    {selectedOfferings.length === 0 ? (
    <div className="rounded-lg border border-strokedark bg-tertiary px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
     <h4 className="text-title-sm mb-4 font-semibold text-white">
        Swap Currency
     </h4>
        <div className="bg-tertiary rounded-lg p-4 shadow-md">
          <form>
          <div className="rounded-sm bg-tertiary text-white">
              <div className="flex flex-col gap-5.5">
                <div>
                <label className="mb-2.5 block text-white ">
                    Payin Currency
                  </label>
                  <div className={`relative 'bg-light-blue' : ''}`}>
                  <select
                    name="payinCurrency"
                    value={formData.payinCurrency}
                    onChange={handleInputChange}
                    required
                    placeholder="NGN"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-tertiary py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">Select currency</option>
                    {payinCurrencyCodes.map(code => (
                      <option value={code}>{code}</option>
                    ))}
                  </select>
                  </div>
                </div>

                <div>
                <label className="mb-2.5 block text-white ">
                    Payout Currency
                  </label>
                  <div className={`relative 'bg-light-blue' : ''}`}>
                  <select
                    name="payoutCurrency"
                    value={formData.payoutCurrency}
                    onChange={handleInputChange}
                    required
                    placeholder="USD"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-tertiary py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">Select currency</option>
                    {payoutCurrencyCodes.map(code => (
                      <option value={code}>{code}</option>
                    ))}
                  </select>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchOfferings}
              disabled={loading}
              className="mr-5 mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-6  h-6 border-t-2 border-primary border-solid rounded-full animate-spin" />
                  <span>loading...</span>
                </div>
              ) : (
                <>Get Offerings</>
              )}
            </button>
          </form>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedOfferings?.map((offering, index) => (
            <div key={index} className="bg-tertiary text-white rounded-lg shadow-md p-6">
              <h5 className="text-lg font-semibold mb-2">
                {
                  PFIs.find((pfi) => pfi.did === offering.metadata.from)?.name
                }
              </h5>
              <p className="text-md mb-2">
                {offering.data.description}
              </p>
              <p className="">
                <strong>Payin Methods:</strong>{' '}
                {offering.data.payin.methods.map((method: any, methodIndex: number) => (
                  <span key={methodIndex} className="inline-block bg-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
                    {method.kind}
                  </span>
                ))}
              </p>
              <p className="">
                <strong>Conversion Rate:</strong> 1 {offering.data.payin.currencyCode} ={' '}
                {offering.data.payoutUnitsPerPayinUnit} {offering.data.payout.currencyCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Convert;



