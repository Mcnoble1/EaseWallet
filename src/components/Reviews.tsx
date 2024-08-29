import React from 'react'

const Reviews = () => {
  return (
    <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <div className="flex flex-col gap-4">
                  {pfi.reviews.map((review, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 1a1 1 0 011 1v6.586l2.707-2.707a1 1 0 011.414 0l.586.586a1 1 0 010 1.414L11 12.414V19a1 1 0 01-2 0v-6.586L6.293 12.707a1 1 0 01-1.414 0l-.586-.586a1 1 0 010-1.414L9 7.586V2a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-1">{review.rating}</span>
                      </div>
                      <p className="ml-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
  )
}

export default Reviews