import { toast } from 'react-toastify';
import { faDollarSign, faPiggyBank, faCreditCard, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { IconType } from 'react-icons';
import { FaBitcoin } from 'react-icons/fa';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import Flag from 'react-flagkit';
import { Jwt, PresentationExchange } from '@web5/credentials'

const offerings = JSON.parse(localStorage.getItem('offerings') || '{}');

export const showSuccessNotification = (message: string) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
  });
};

export const showErrorNotification = (message: string) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
  });
};

export const PFIs = [
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
export const currencyIcons: { [key: string]: IconType | JSX.Element } = {
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


export const formatDatetime = (datetimeString: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(datetimeString).toLocaleDateString(undefined, options);
  return formattedDate;
};

export const filterOfferings = (payinCurrency: string, payoutCurrency: string) => {
  const filteredOfferings: any[] = [];
  Object.values(offerings).forEach(transactions => {
    transactions.forEach(transaction => {
      const { payin, payout } = transaction.data;

      if (payin.currencyCode === payinCurrency && payout.currencyCode === payoutCurrency) {
        filteredOfferings.push(transaction);
      }
    });
});
  
    return filteredOfferings;
}

export const satisfiesOfferingRequirements = (offering, credentials) => {
  if(credentials.length === 0 || !offering.data.requiredClaims) {
    return false;
  }

  try {
    // Validate user's VCs against the offering's presentation definition
    PresentationExchange.satisfiesPresentationDefinition({
      vcJwts: credentials,
      presentationDefinition: offering.data.requiredClaims,
    })
    return true
  } catch (e) {
    return false
  }
}

export const loadCredentials = () => {
  const storedCredentials = localStorage.getItem('userCredentials');
  if (storedCredentials) {
    userCredentials = JSON.parse(storedCredentials);
  } else {
    console.log('No credentials exist');
  }
};

export const addCredential = (credential) => {
  userCredentials.push(credential);
  localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
};

export const renderCredential = (credentialJwt) => {
  const vc = Jwt.parse({ jwt: credentialJwt }).decoded.payload['vc']
  return {
    title: vc.type[vc.type.length - 1].replace(/(?<!^)(?<![A-Z])[A-Z](?=[a-z])/g, ' $&'), // get the last credential type in the array and format it with spaces
    name: vc.credentialSubject['name'],
    countryCode: vc.credentialSubject['countryOfResidence'],
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  }
}


