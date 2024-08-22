import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PFIs, currencyIcons} from '../utils/helpers';

const CardOne = () => {
  const [selectedOfferings, setSelectedOfferings] = useState<{ [key: string]: any[] }>({});
  const [visibleOfferings, setVisibleOfferings] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const offeringsData = JSON.parse(localStorage.getItem('offerings') || '{}');
    if (offeringsData) {
      setSelectedOfferings(offeringsData);
      console.log(offeringsData);
    }
  }, []);

  const navigate = useNavigate();

  const handleCardClick = (did) => {
    navigate(`/payments/pfi/${did}`);
  };

  const toggleOfferingsVisibility = (did: string) => {
    setVisibleOfferings((prev) => ({
      ...prev,
      [did]: !prev[did]
    }));
  };

  return (
    <>
      {PFIs.map((pfi) => (
        <div
          key={pfi.did}
          className={`relative flex flex-col rounded-lg py-3 px-7.5 shadow-default transition-all duration-300`}
          style={{
            backgroundColor: pfi.backgroundColor,
            marginBottom: '15px'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-between">
              <p className="text-white text-lg font-bold cursor-pointer" onClick={() => handleCardClick(pfi.did)}>{pfi.name}</p>
              <span
                className="mt-2 text-white underline cursor-pointer"
                style={{ textAlign: 'left' }}
                onClick={() => toggleOfferingsVisibility(pfi.did)}
              >
                See Offerings
              </span>
            </div>
            <div className={`flex h-11.5 w-11.5 items-center justify-center rounded bg-white/80`}>
              <FontAwesomeIcon icon={pfi.icon} style={{ color: pfi.backgroundColor }} />
            </div>
          </div>

          {visibleOfferings[pfi.did] && selectedOfferings[pfi.did] && (
            <div
              className="absolute top-full left-0 mt-2 w-full rounded-lg p-4 shadow-lg z-10"
              style={{
                backgroundColor: pfi.backgroundColor,
              }}
            >
              {selectedOfferings[pfi.did].map((offering, i) => (
                <div key={i} className="flex items-center mt-2">
                  {currencyIcons[offering.data.payin.currencyCode]}
                  <p className="text-white text-lg ml-2">
                  {offering.data.payin.currencyCode} to {offering.data.payout.currencyCode}&nbsp;&nbsp;
                  </p>
                  {currencyIcons[offering.data.payout.currencyCode]}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CardOne;
