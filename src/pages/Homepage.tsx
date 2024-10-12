import { useState } from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
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
    // Add the rest of the countries here
  ];

  const features = [
    {
      title: 'PCI DSS',
      description: 'EaseWallet is PCI DSS Level 1 certified. PCI DSS compliance is the Payment Card Industry Data Security Standard. It ensures that all companies that process, store.',
      icon: '/icons/pci-dss.png', // Add your PCI DSS icon here
    },
    {
      title: '24/7 Support',
      description: '24/7 live support via chat and phone to provide assistance to real humans.',
      icon: '/icons/support.png', // Add your Support icon here
    },
  ];

  const faqs = [
    {
      question: 'Is Easewallet a bank?',
      answer: 'Easewallet is a decentralized wallet service, not a bank. It facilitates cross-border payments using blockchain technology but does not offer banking services or store your funds.',
    },
    {
      question: 'Where is Easewallet available?',
      answer: 'Easewallet is available globally and supports various fiat and cryptocurrencies for seamless transactions across borders.',
    },
    {
      question: 'How does Easewallet work?',
      answer: 'Easewallet works by leveraging blockchain to facilitate secure and efficient cross-border payments, allowing users to transfer funds quickly and cost-effectively.',
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
          Open multi-currency accounts. Send and receive funds globally with Easewallet.
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
        <h1 className="text-5xl font-bold">One platform for all your <span className="text-secondary">international</span> <br /> <span className="underline decoration-secondary">payments</span></h1>
        </section>
      </div>
    </div>

    <section className="flex flex-col lg:flex-row justify-center items-center py-20 bg-white">
      <div className="lg:w-1/2">
        <img src={PhoneImage} alt="Phone with app" className="h-100 w-100" />
      </div>
      <div className="lg:w-1/2 pl-10">
        <h2 className="text-3xl font-bold">Open global accounts</h2>
        <p className="text-lg mt-4">Open accounts in US Dollars, Canadian Dollars, and Great British Pounds in minutes.</p>
        <button className="mt-6 bg-secondary text-white py-2 px-6 rounded-full">See more</button>
      </div>
    </section>

    <section className="flex flex-col lg:flex-row justify-center items-center py-20 bg-white">
      <div className="lg:w-1/2 pl-10">
        <h2 className="text-3xl font-bold">Currency conversion</h2>
        <p className="text-lg mt-4">Convert money from one currency to another on the Easewallet app at zero fees.</p>
        <button className="mt-6 bg-secondary text-white py-2 px-6 rounded-full">See more</button>
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
          We charge <span className="bg-white text-black px-2 py-1 rounded">Zero transfer fees</span> for you to spend your own money. Take back control of your financial life with Easewallet.
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

    <section className="flex flex-col lg:flex-row justify-between items-center py-20 bg-gray-100 text-black">
      <div className="lg:w-1/2 pl-10">
        <h2 className="text-3xl font-bold mb-4">Easewallet is decentralized and available globally</h2>
        <p className="text-lg mb-6">
          We are growing and expanding fast, join our waitlist and get notified when PFIs from your country get onboarded.
        </p>
        <button className="bg-green-400 text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-secondary transition duration-300">
          Join waitlist
        </button>
      </div>
      <div className="w-1/2 flex justify-end">
        <img src={PhoneImage} alt="Global" className="h-100 w-100" />
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

    <section className="py-20 bg-white text-black">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">How we protect your money and identity</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-5">
        {features.map((feature, index) => (
          <div key={index} className="p-6 border-2 rounded-lg shadow-lg text-center">
            <img src={feature.icon} alt={feature.title} className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="mt-4">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-20 bg-gray-50 text-black">
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
        <div className="text-center mt-10">
          <button className="px-6 py-3 bg-secondary text-white rounded-full">See general FAQs</button>
        </div>
      </div>
    </section>

    <section className="bg-purple-100 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-black mb-6">
          See for yourself how easy it is to move your money around the world with Easewallet.
        </h1>
        <p className="mb-8">
          <button className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700">
            <span role="img" aria-label="phone">📱</span> Download now
          </button>
        </p>
        <div className="flex justify-center">
          <img
            src="/path-to-your-image" // Update with the actual path to the app mockup
            alt="Easewallet App"
            className="max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>
      </div>
    </section>


    <section className="bg-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Stay updated with Easewallet by signing up for our newsletter
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
            Subscribe
          </button>
        </form>
      </div>
    </section>


    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h1 className="text-4xl font-bold text-secondary">Easewallet</h1>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center sm:text-left">
          <div>
            <h4 className="font-semibold">Products</h4>
            <ul>
              <li>Cross-border Payments</li>
              <li>Crypto Wallet</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Support</h4>
            <ul>
              <li>Contact Us</li>
              <li>Submit a Request</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
    </>
    
  );
};

export default Homepage;
