import React, { useState } from 'react';

const AddCard = ({ userId }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const validateCardDetails = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      return 'Card number must be 16 digits.';
    }

    if (expiryMonth < 1 || expiryMonth > 12) {
      return 'Expiry month must be between 01 and 12.';
    }

    if (expiryYear < currentYear || (expiryYear == currentYear && expiryMonth < currentMonth)) {
      return 'Expiry date must be in the future.';
    }

    if (cvc.length !== 3 || isNaN(cvc)) {
      return 'CVC must be 3 digits.';
    }

    return null; // No errors
  };

  const handleAddCard = async () => {
    const validationError = validateCardDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null); // Clear previous errors
    const response = await fetch(`/api/wallet/addCard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        cardDetails: {
          cardNumber,
          expiryMonth,
          expiryYear,
          cvc,
        },
      }),
    });
    const result = await response.json();
    setStatus(result.message);
  };

  return (
    <div className="p-6 bg-gray rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Credit/Debit Card</h2>

      {error && <p className="text-danger mb-4">{error}</p>}
      {status && <p className="text-green-600 mb-4">{status}</p>}

      <div className="mb-4">
        <label className="block font-medium">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="p-2 border rounded w-full"
          maxLength={16} // Limit to 16 characters
        />
      </div>

      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block font-medium">Expiry Month</label>
          <input
            type="text"
            name="expiryMonth"
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="MM"
            min={1}
            max={12}
            maxLength={2}
          />
        </div>
        <div>
          <label className="block font-medium">Expiry Year</label>
          <input
            type="text"
            value={expiryYear}
            name='expiryYear'
            onChange={(e) => setExpiryYear(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="YYYY"
            maxLength={4}
            min={new Date().getFullYear()} // Ensure only future years are allowed
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium">CVC</label>
        <input
          type="text"
          name='cvc'
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
          className="p-2 border rounded w-full"
          maxLength={3} // Limit to 3 characters
        />
      </div>

      <button
        className="bg-secondary text-white py-2 px-4 rounded-lg"
        onClick={handleAddCard}
      >
        Add Card
      </button>
    </div>
  );
};

export default AddCard;
