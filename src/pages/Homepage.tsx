import { useState } from "react";
import PhoneImage from "../images/money.png";
import ConversionImage from "../images/world.png";
import NoFeesImage from "../images/rocket.png";
import { Link, useNavigate } from 'react-router-dom';
import { currencyIcons } from "../utils/helpers";

const countries = [
    { name: 'NGN' },
    { name: 'GHS' },
    { name: 'KES' },
    { name: 'MXN' },
    { name: 'ZAR' },
    { name: 'USD' },
    { name: 'GBP' },
    { name: 'EUR' },
    { name: 'AUD' },
    { name: 'BTC' },
    { name: 'USDC' },
  ];

const features = [
    {
      title: 'Secure & Compliant',
      description: 'Built on tbDEX SDK, EaseWallet provides secure and compliant cross-border payments using blockchain technology and Decentralized Identifiers (DIDs).',
      icon: '/icons/security.png', 
    },
    {
      title: 'DID & Verifiable Credentials',
      description: 'Easewallet allows users to manage their decentralized identifiers (DIDs) and authenticate identity with Verifiable Credentials (VCs).',
      icon: '/icons/did.png', 
    },
    {
      title: 'Real-Time Updates',
      description: 'Track your cross-border payments in real-time as they move through RFQs, quotes, and order completion.',
      icon: '/icons/realtime.png',
    },
    {
    title: '24/7 Support',
    description: '24/7 live support via chat and phone to provide assistance to real humans.',
    icon: '/icons/support.png',
    },
];

  const faqs = [
    {
      question: 'Where is Easewallet available?',
      answer: 'Easewallet is available globally and supports various fiat and cryptocurrencies for seamless transactions across borders.',
    },
    {
        question: 'Is EaseWallet a bank?',
        answer: 'No, EaseWallet is a decentralized wallet application built to facilitate cross-border payments, not a traditional bank.',
    },
    {
      question: 'How does Easewallet work?',
      answer: 'Easewallet works by leveraging blockchain to facilitate secure and efficient cross-border payments, allowing users to transfer funds quickly and cost-effectively.',
    },
  ];

  const benefits = [
      {
        icon: '/assets/icons/liquidity-providers.svg',
        title: 'Multiple Liquidity Providers',
        description: 'Choose the best offer from our sandbox of liquidity providers for the best rates and speeds.',
      },
      {
        icon: '/assets/icons/low-fees.svg',
        title: 'Low Fees',
        description: 'We offer competitive, low fees on cross-border transactions.',
      },
      {
        icon: '/assets/icons/rating-system.svg', 
        title: 'PFI Ratings',
        description: 'Review and rate Payment Facilitator Institutions (PFIs) after each transaction for transparency.',
      },
      {
        icon: '/assets/icons/wallet-features.svg', 
        title: 'Multi-Currency Wallet',
        description: 'Hold, send, and receive multiple currencies securely within EaseWallet’s built-in wallet.',
      },
    {
      icon: '/assets/icons/payment-methods.svg', 
      title: 'Local payment methods',
      description: 'Instant and localized payment methods including bank transfer and mobile money.',
    },
    {
      icon: '/assets/icons/designed-for-africa.svg',
      title: 'Designed for Africa',
      description: 'Designed and built with African customers in mind to drive high conversion.',
    },
  ];


  
const Homepage = () => {
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
      setActiveIndex(index === activeIndex ? null : index);
    };

    const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, like calling an API to save the email.
    console.log('Email submitted:', email);
  };

  return (
    <>
    <div className="bg-tertiary h-screen text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="text-3xl font-bold text-yellow">Easewallet</div>
        <div className="space-x-8 text-lg">
        <Link to={'/signin'}>
          <button className="bg-secondary px-4 py-2 rounded text-white">Get Started 🚀</button>
        </Link>
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 lg:py-5">
        <h1 className="text-5xl font-bold mb-6 lg:mb-3">
          Cross-border payments made easy
        </h1>
        <p className="text-xl mb-2">
           Send and receive funds globally with EaseWallet, powered by tbDEX protocol.
        </p>
        <div className="flex justify-end">
            <img src={ConversionImage} alt="Global" className="h-80 w-80 lg:h-70 lg:w-70" />
      </div>
        {/* Phone number input section */}
        <div className="flex items-center justify-center mb-4">
            <Link to={'/signin'}>
                <button className="bg-secondary text-white px-6 py-2 ml-4  rounded text-lg">
                    Get Started 🚀
                </button>
            </Link>
        </div>
      </div>
    </div>

    <div className="bg-white">    
      {/* Tagline Section */}
      <div className="text-center py-20">
        <section className="text-center py-20 text-black">
          <h1 className="text-5xl font-bold">Your platform for <span className="text-white rounded-2xl px-1 bg-tertiary">fast</span>, <span className="text-secondary">secure</span> and <br /> <span className="underline decoration-secondary">compliant</span> cross-border payments</h1>
        </section>
      </div>
    </div>

    <section className="flex flex-col lg:flex-row justify-center items-center py-10 bg-gray">
      <div className="lg:w-1/2">
        <img src={PhoneImage} alt="Phone with app" className="h-100 w-100" />
      </div>
      <div className="lg:w-1/2 pl-10">
        <h2 className="text-3xl font-bold">Open global accounts</h2>
        <p className="text-lg mt-4">Open accounts in US Dollars, Canadian Dollars, and Great British Pounds in minutes.</p>
      </div>
    </section>

        <section className="flex flex-col lg:flex-row justify-center items-center py-10 bg-white">
          <div className="lg:w-1/2">
            <img src={PhoneImage} alt="Phone with app" className="h-100 w-100" />
          </div>
          <div className="lg:w-1/2 pl-10">
            <h2 className="text-3xl font-bold">Manage Multiple Currencies</h2>
            <p className="text-lg mt-4">Hold, send, and receive funds in USD, GHS, EUR, BTC, and more through our decentralized wallet.</p>
          </div>
        </section>


    <section className="flex flex-col lg:flex-row justify-center items-center py-20 bg-gray">
      <div className="lg:w-1/2 pl-10">
        <h2 className="text-3xl font-bold">Currency conversion</h2>
        <p className="text-lg mt-4">Convert money from one currency to another on the Easewallet app at zero fees.</p>
      </div>
      <div className="lg:w-1/2">
        <img src={ConversionImage} alt="Currency conversion feature" className="h-100 w-100" />
      </div>
    </section>

    <section className="flex flex-col lg:flex-row justify-center items-center py-20 bg-black text-white">
      <div className="lg:w-1/2">
        <img src={NoFeesImage} alt="Say bye-bye to fees" className="h-100 w-100" />
      </div>
      <div className="lg:w-1/2 pl-10">
        <h2 className="text-4xl font-bold text-purple-400">Say bye-bye to fees</h2>
        <p className="text-lg mt-4">
           Enjoy <span className="bg-white text-black px-2 py-1 rounded">Zero transfer fees</span> for cross-border payments. We charge a low, transparent flat fee for services.
        </p>
        <ul className="mt-6 space-y-4">
          <li className="flex items-center">
            <img src={PhoneImage} alt="No monthly fees" className="w-8 h-8 mr-4" />
            No monthly or subscription fees
          </li>
          <li className="flex items-center">
            <img src={ConversionImage} alt="No minimum balance" className="w-8 h-8 mr-4" />
            No minimum balance
          </li>
          <li className="flex items-center">
            <img src={NoFeesImage} alt="Zero foreign transfer fees" className="w-8 h-8 mr-4" />
            Zero foreign transfer fees
          </li>
        </ul>
      </div>
    </section>

    <section className="py-20 bg-white text-black">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">10+ Currencies across the world and Stables</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
      {/* {currencyIcons[offering.data.payin.currencyCode]} */}
        {countries.map((country, index) => (
          <div key={index} className="flex flex-col items-center space-y-3 rounded-full">
            {currencyIcons[country.name]}
            <p className="font-medium">{country.name}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-10 bg-white text-black">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">How we protect your money and identity</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-10">
        {features.map((feature, index) => (
          <div key={index} className="p-6 border-2 rounded-lg shadow-lg text-center">
            <img src={feature.icon} alt={feature.title} className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="mt-4">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>


    <section className="bg-gray-100 py-16 mx-10">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Why use Easewallet?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <img src={benefit.icon} alt={benefit.title} className="w-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-10 bg-gray-50 text-black">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">Got questions?</h2>
        <p className="mt-2 text-lg">Some of the most frequently asked questions.</p>
      </div>
      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 rounded-lg mb-4 p-4"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <span>{activeIndex === index ? '▲' : '▼'}</span>
            </div>
            {activeIndex === index && <p className="mt-4">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Join our waitlist and get notified when we Ship 🚀
        </h2>
        <form onSubmit={handleSubmit} className="flex justify-center mt-6">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-md p-4 rounded-l-full border border-gray-300 focus:outline-none focus:border-secondary"
            required
          />
          <button
            type="submit"
            className="bg-secondary text-white px-8 py-4 rounded-r-full hover:bg-secondary-dark"
          >
            Notify me
          </button>
        </form>
      </div>
    </section>
        <footer className="py-10 bg-tertiary text-white text-center">
          <p>© 2024 EaseWallet - All Rights Reserved.</p>
        </footer>
    </>
    
  );
};

export default Homepage;
