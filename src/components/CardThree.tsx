import welcome from '../images/user/welcome.svg';
const CardThree = () => {
  return (
    <div className="flex h-25 justify-between rounded-lg bg-tertiary py-3 px-7.5 shadow-default">
       <div className="flex justify-between">
        <div>
          <p className="text-white text-lg font-bold">Good Morning, John</p>
        </div>
      </div>
      
      <div className="flex h-22">
        <img src={welcome} alt="Welcome" />
      </div>
    </div>
  );
};

export default CardThree;
