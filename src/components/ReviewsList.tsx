import React from 'react';

interface Review {
  rating: number;
  review: string;
  name: string;
  pfi: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  return (
    <div className="mx-auto">
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
      ) : (
        reviews?.map((review, index) => (
          <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-yellow text-2xl">★</span>
              ))}
              {[...Array(5 - review.rating)].map((_, i) => (
                <span key={i} className="text-gray-300 text-2xl">★</span>
              ))}
            </div>
            <p className="text-gray-700">{review.review}</p>
            <p className="text-sm text-gray-500 mt-2">- {review.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsList;
