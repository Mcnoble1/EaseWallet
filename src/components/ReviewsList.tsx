import React from 'react';

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
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
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
                {/* Avatar */}
                <img
                  src={avatars[index % avatars.length]} // Choose an avatar based on the index
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  {/* Name */}
                  <p className="font-semibold text-white">-{review.name}</p>
                  {/* Transaction Performed */}
                  <p className="text-sm text-white">{review.transaction}</p>
                </div>
              </div>
              {/* Star Rating */}
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
