import React, { useState, useEffect } from 'react'
import { TbdexHttpClient } from '@tbdex/http-client';
import { filterOfferings, PFIs } from '../utils/helpers';

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
    <div className="">
    <h4 className="text-title-sm mb-4 font-semibold text-white">Offerings</h4>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      {offerings?.map((offering, index) => (
          <div key={index} onClick={() => handleOfferingClick(offering)} className="bg-tertiary text-white rounded-lg shadow-md p-3 cursor-pointer hover:bg-opacity-100">
            <div className='flex justify-between'>
              <h5 className="text-md font-semibold mb-2">
              {offering.data.payin.currencyCode} to {offering.data.payout.currencyCode}              </h5>
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
          </div>
          // <button className="bg-primary text-white rounded-lg p-2 mt-4">Exchange</button>
        ))}
      </div>
    </div>
  )
}

export default Offerings


