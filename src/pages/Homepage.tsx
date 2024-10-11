import PhoneImage from "../images/user/1.png";
import ConversionImage from "../images/user/3.png";
import NoFeesImage from "../images/user/4.png";
import { Link, useNavigate } from 'react-router-dom';
const Homepage = () => {
    const navigate = useNavigate();
  return (
    <>
    <div className="bg-tertiary min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="text-3xl font-bold text-yellow">Easewallet</div>
        <div className="space-x-8 text-lg">
        <Link to={'/signin'}>
          <button className="bg-secondary px-4 py-2 rounded text-white">Get In</button>
        </Link>
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-5xl font-bold mb-4">
          Cross-border payments made easy
        </h1>
        <p className="text-xl mb-8">
          Open multi-currency accounts. Send and receive funds globally with Easewallet.
        </p>

        {/* Phone number input section */}
        <div className="flex items-center justify-center mb-4">
            <Link to={'/signin'}>
                <button className="bg-secondary text-white px-6 py-2 ml-4 rounded">
                    Get Started
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

    <section className="flex justify-center items-center py-20 bg-white">
      <div className="w-1/2">
        <img src={PhoneImage} alt="Phone with app" className="h-100 w-100" />
      </div>
      <div className="w-1/2 pl-10">
        <h2 className="text-3xl font-bold">Open global accounts</h2>
        <p className="text-lg mt-4">Open accounts in US Dollars, Canadian Dollars, and Great British Pounds in minutes.</p>
        <button className="mt-6 bg-secondary text-white py-2 px-6 rounded-full">See more</button>
      </div>
    </section>

    <section className="flex justify-center items-center py-20 bg-white">
      <div className="w-1/2 pl-10">
        <h2 className="text-3xl font-bold">Currency conversion</h2>
        <p className="text-lg mt-4">Convert money from one currency to another on the Easewallet app at zero fees.</p>
        <button className="mt-6 bg-secondary text-white py-2 px-6 rounded-full">See more</button>
      </div>
      <div className="w-1/2">
        <img src={ConversionImage} alt="Currency conversion feature" className="h-100 w-100" />
      </div>
    </section>

    <section className="flex justify-center items-center py-20 bg-black text-white">
      <div className="w-1/2">
        <img src={NoFeesImage} alt="Say bye-bye to fees" className="h-100 w-100" />
      </div>
      <div className="w-1/2 pl-10">
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
    </>
    
  );
};

export default Homepage;
