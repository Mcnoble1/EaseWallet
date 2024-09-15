import React from 'react';
import One from '../images/user/1.png';
import Two from '../images/user/3.png';
import Three from '../images/user/4.png';
interface Review {
  rating: number;
  review: string;
  name: string;
  pfi: string;
  transaction: string;  // Added transaction field
}

interface ReviewsListProps {
  reviews: Review[];
}

// List of dummy avatars
const avatars = [
  One,
  Two,
  Three,
];

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  // Calculate the average rating
  const averageRating = reviews?.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mx-auto">
      {reviews && reviews.length === 0 ? (
        <p className="text-gray-10">No reviews yet. Be the first to leave one!</p>
      ) : (
        <div>
          {/* Display the average rating */}
          <div className="flex items-center justify-center mb-6">
            <span className="text-yellow text-2xl font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-gray text-2xl ml-2">/ 5</span>
          </div>

          {/* Render the list of reviews */}
          {reviews?.map((review, index) => (
            <div key={index} className="bg-tertiary p-4 mb-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={avatars[index % avatars.length]}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-white">-{review.name}</p>
                  <p className="text-sm text-white">{review.transaction}</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow text-2xl">★</span>
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <span key={i} className="text-gray-200 text-2xl">★</span>
                ))}
              </div>
              {/* Review Text */}
              <p className="text-white">{review.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
