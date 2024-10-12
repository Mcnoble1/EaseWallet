import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Offerings = ({ pfiDid }) => {
    const navigate = useNavigate();
    const offeringsData = JSON.parse(localStorage.getItem('offerings') || '{}');
    const [trades, setTrades] = useState<number>(0);
    const [completionRate, setCompletionRate] = useState<number>(0);

    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
    
      const hoursStr = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
      const minutesStr = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
      const secondsStr = remainingSeconds > 0 ? `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}` : '';
      return [hoursStr, minutesStr, secondsStr].filter(Boolean).join(', ');
    }

    const handleOfferingClick = (offering: any) => {
      // localStorage.setItem('selectedOffering', JSON.stringify(offering));
      // localStorage.setItem('selectedStep', '3');
      navigate('/payments/send');
    }

  return (
    <div className="">
    <h4 className="text-title-sm mb-4 font-semibold text-white">Offerings</h4>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      {offeringsData[pfiDid]?.map((offering, index) => (
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

            <div className='flex text-sm justify-between'>
              <p>Trades {trades}</p>
              <p>Completion Rate {completionRate}%</p>
            </div>
          </div>
          // <button className="bg-primary text-white rounded-lg p-2 mt-4">Exchange</button>
        ))}
      </div>
    </div>
  )
}

export default Offerings













