import React, { useState, useEffect } from 'react'
import { TbdexHttpClient } from '@tbdex/http-client';

const Offerings = ({ pfiDid }) => {
    const [offerings, setOfferings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOfferings = async () => {
        const offerings = await TbdexHttpClient.getOfferings({
            pfiDid: pfiDid
          });
        setOfferings(offerings);
        }
    useEffect(() => {
        fetchOfferings();
        // setLoading(false);
    }, []); 

  return (
    <div className="">
    <h4 className="text-title-sm mb-4 font-semibold text-white">Offerings</h4>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      {offerings.map((offering, index) => (
            <div key={index} className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center">
                <p className="text-lg font-semibold">{offering.data.description}</p>
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
                <button className="bg-primary text-white rounded-lg p-2 mt-4">Exchange</button>
            </div>
        ))}
        </div>
    </div>
  )
}

export default Offerings