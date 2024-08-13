import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDown } from '@fortawesome/free-solid-svg-icons';
import welcome from '../images/user/welcome.svg';
const CardThree = () => {
  return (
    <div className="flex h-30 justify-between rounded-lg bg-tertiary py-3 px-7.5 shadow-default">
       <div className="flex justify-between">
        <div>
          <p className="text-white text-xs font-semibold">Welcome back to Wallet</p>
          <p className="text-white text-lg font-bold">Good Morning, John</p>
        </div>
      </div>
      
      <div className="flex h-27">
        <img src={welcome} alt="Welcome" />
      </div>
    </div>
  );
};

export default CardThree;
