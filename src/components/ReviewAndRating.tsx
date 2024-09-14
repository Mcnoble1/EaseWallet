import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppContext } from '../utils/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ReviewAndRatingProps {
  onSubmit: (rating: number, review: string) => void;
  onClose: () => void;
}

const ReviewAndRating: React.FC<ReviewAndRatingProps> = ({ onSubmit, onClose }) => {

  const { userId } = useContext(AppContext);

  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (rating === 0 || review.trim() === '') {
      setError('Please provide a rating and review');
      return;
    }
    setError(null);
    onSubmit(rating, review);
  };

  return (
    <div className="max-w-lg mx-auto bg-tertiary p-6 rounded-lg shadow-md">
        <div className="flex justify-end">
        <FontAwesomeIcon 
          icon={faXmark} 
          className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition duration-150"
          onClick={onClose}
        />
      </div>
      <h2 className="text-xl font-semibold mb-4">Rate your experience</h2>
      
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl cursor-pointer transition-colors ${
              star <= rating ? 'text-yellow' : 'text-gray-100'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="w-full text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      {error && <p className="text-danger mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewAndRating;
