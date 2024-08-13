import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPiggyBank, faCreditCard, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { IconType } from 'react-icons';
import { FaBitcoin } from 'react-icons/fa';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import Flag from 'react-flagkit';

import { TbdexHttpClient } from '@tbdex/http-client';

const PFIs = [
  {
    did: 'did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y',
    name: 'AquaFinance Capital',
    description: 'Provides exchanges with the Ghanaian Cedis: GHS to USDC, GHS to KES',
    icon: faDollarSign,
    backgroundColor: '#1e3a8a' // Navy Blue
  },
  {
    did: 'did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy',
    name: 'Flowback Financial',
    description: 'Offers international rates with various currencies - USD to GBP, GBP to CAD.',
    icon: faPiggyBank,
    backgroundColor: '#065f46' // Dark Green
  },
  {
    did: 'did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y',
    name: 'Vertex Liquid Assets',
    description: 'Offers exchange rates with the South African Rand: ZAR to BTC and EUR to ZAR.',
    icon: faCreditCard,
    backgroundColor: '#b91c1c' // Dark Red
  },
  {
    did: 'did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o',
    name: 'Titanium Trust',
    description: 'Offers exchange rates with the South African Rand: ZAR to BTC and EUR to ZAR.',
    icon: faChartLine,
    backgroundColor: '#4a5568' // Dark Gray
  }
];

// Mapping currency codes to flag components or custom icons
const currencyIcons: { [key: string]: IconType | JSX.Element } = {
  GHS: <Flag country="GH" />, // Ghana
  NGN: <Flag country="NG" />, // Nigeria
  KES: <Flag country="KE" />, // Kenya
  USD: <Flag country="US" />, // USA
  AUD: <Flag country="AU" />, // Australia
  GBP: <Flag country="GB" />, // UK
  EUR: <Flag country="EU" />, // Europe
  ZAR: <Flag country="ZA" />, // South Africa
  MXN: <Flag country="MX" />, // Mexico
  BTC: <FaBitcoin color="orange" />, // Bitcoin
  USDC: <RiMoneyDollarCircleLine color="blue" />, // USDC
};

const CardOne = () => {
  const [selectedOfferings, setSelectedOfferings] = useState<{ [key: string]: any[] }>({});
  const [visibleOfferings, setVisibleOfferings] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const prefetchOfferings = async () => {
      try {
        const offeringsData: { [key: string]: any[] } = {};
        for (const pfi of PFIs) {
          const offerings = await TbdexHttpClient.getOfferings({
            pfiDid: pfi.did
          });
          offeringsData[pfi.did] = offerings;
        }
        setSelectedOfferings(offeringsData);
      } catch (error) {
        console.error('Failed to prefetch offerings:', error);
      }
    };

    prefetchOfferings();
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
