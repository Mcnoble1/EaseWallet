import { useState, useEffect, useContext } from 'react';
import { AppContext } from "../utils/AppContext";
import welcome from '../images/user/welcome.svg';
import sunlightIcon from '../images/icon/sun.png';
import moonIcon from '../images/icon/moon.png'; 

const Greeting = () => {

const { email } = useContext(AppContext);

  const [greeting, setGreeting] = useState('Good Morning');
  const [icon, setIcon] = useState(sunlightIcon);

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: userTimeZone, hour: '2-digit', hour12: false });
        const currentHour = parseInt(currentTime, 10);
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good Morning');
      setIcon(sunlightIcon);
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good Afternoon');
      setIcon(sunlightIcon);
    } else if (currentHour >= 18 && currentHour < 22) {
      setGreeting('Good Evening');
      setIcon(moonIcon);
    } else {
      setGreeting('Good Night');
      setIcon(moonIcon);
    }
  }, []);

  return (
    <div className="lg:w-[50%] flex h-25 justify-between rounded-lg bg-tertiary py-3 px-7.5 shadow-default">
      <div className="flex flex-col">
        <div className='flex gap-2'>
          <p className="text-white text-lg font-bold">{greeting}</p>
          <img src={icon} alt="Greeting Icon" className="mr-2 h-6 w-6" />
        </div>
        <div>
          <p className="text-white text-lg font-bold">{email}</p>
        </div>
      </div>    
      <div className="flex h-22">
        <img src={welcome} alt="Welcome" />
      </div>
    </div>
  );
};

export default Greeting;
