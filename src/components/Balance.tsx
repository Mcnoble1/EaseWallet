import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faWallet } from '@fortawesome/free-solid-svg-icons';

const Balance = ({ user }) => {
  const [currency, setCurrency] = useState('NGN'); // Default currency
  const [balance, setBalance] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Fetch wallet balance from the backend
    const fetchWalletData = async () => {
      const response = await fetch(`/api/wallet/${user.id}?currency=${currency}`);
      const data = await response.json();
      setBalance(data.balance);
    };
    fetchWalletData();
  }, [currency, user?.id]);

  const handleSend = async () => {
    // Trigger send logic here
    const response = await fetch(`/api/wallet/send`, {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, currency, amount })
    });
    const result = await response.json();
    if (result.success) {
      setBalance(result.balance);
    }
    setShowSendModal(false); // Close modal after sending
  };

  const handleWithdraw = async () => {
    // Trigger withdrawal logic here
    const response = await fetch(`/api/wallet/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, currency, amount })
    });
    const result = await response.json();
    if (result.success) {
      setBalance(result.balance);
    }
    setShowWithdrawModal(false); // Close modal after withdrawing
  };

  return (
    <div className="lg:w-[50%] p-4 bg-gray rounded-lg flex flex-col">
    <div className='flex justify-between gap-10'>
        <p className="text-4xl font-semibold">{balance} {currency}</p>
        <div className="">
          <select
            className=" border rounded"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="NGN">NGN</option>
            <option value="KES">KES</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="ZAR">ZAR</option>
            <option value="GHC">GHC</option>
          </select>
      </div>
    </div>

      {/* <div className="mt-4 flex space-x-4">
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="text-blue-500 text-xl cursor-pointer"
          onClick={() => setShowSendModal(true)}
        />
        <FontAwesomeIcon
          icon={faWallet}
          className="text-green-500 text-xl cursor-pointer"
          onClick={() => setShowWithdrawModal(true)}
        />
      </div> */}

      {showSendModal && (
        <div className="fixed inset-0 flex z-999 items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Send {currency}</h3>
            <input
              type="number"
              className="p-2 border rounded w-full mb-4"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="bg-secondary text-white py-2 px-4 rounded" onClick={handleSend}>
              Send
            </button>
            <button className="ml-4 py-2 px-4 rounded text-white bg-danger" onClick={() => setShowSendModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 flex items-center z-999 justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Withdraw {currency}</h3>
            <input
              type="number"
              className="p-2 border rounded w-full mb-4"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="bg-green text-white py-2 px-4 rounded" onClick={handleWithdraw}>
              Withdraw
            </button>
            <button className="ml-4 py-2 px-4 rounded text-white bg-danger" onClick={() => setShowWithdrawModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balance;
