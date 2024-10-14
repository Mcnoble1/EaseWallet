import React, { useState } from 'react';

const AddBankAccount = ({ userId }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const validateBankDetails = () => {
    if (!accountNumber || isNaN(accountNumber)) {
      return 'Account number must be a valid number.';
    }
    if (!bankCode || isNaN(bankCode)) {
      return 'Bank code must be a valid number.';
    }
    if (!bankName.trim()) {
      return 'Account holder name is required.';
    }
    return null; // No errors
  };

  const handleAddBankAccount = async () => {
    const validationError = validateBankDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null); // Clear previous errors
    const response = await fetch(`/api/wallet/addBankAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        accountNumber,
        bankCode,
        bankName,
      }),
    });
    const result = await response.json();
    setStatus(result.message);
  };

  return (
    <div className="p-6 bg-tertiary rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Bank Account</h2>

      {error && <p className="text-danger mb-4">{error}</p>}
      {status && <p className="text-green mb-4">{status}</p>}

      <div className="mb-4">
        <label className="block font-medium">Bank Name</label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="p-2 border rounded w-full bg-transparent"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Account Number</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="p-2 border rounded w-full bg-transparent"
        />
      </div>

      {/* <div className="mb-4">
        <label className="block font-medium">Bank Code</label>
        <input
          type="text"
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div> */}

      <button
        className="bg-secondary text-white py-2 px-4 rounded-lg"
        onClick={handleAddBankAccount}
      >
        Add Bank Account
      </button>
    </div>
  );
};

export default AddBankAccount;
