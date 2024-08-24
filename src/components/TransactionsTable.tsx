import React, { useState, useRef, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'; 
import { getFeedbacks, deleteFeedback } from '../api/feedbackApi';
import { formatDatetime } from '../utils/helpers';

interface Complaint {
  _id: number;
  worker: string;
  type: string;
  complaint: string;
  createdAt: string;
  
}

const TransactionsTable: React.FC = ({ onClick }) => {
  const [complaintsData, setTransactionsData] = useState<Complaint[]>([]);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [feedbackToDeleteId, setFeedbackToDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [sortPopupOpen, setSortPopupOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const popup = useRef<HTMLDivElement | null>(null);

  const showDeleteConfirmation = (feedbackId: number) => {
    setFeedbackToDeleteId(feedbackId);
    setDeleteConfirmationVisible(true);
  };
  
  const hideDeleteConfirmation = () => {
    setFeedbackToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };

  const closePopup = (stateSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    stateSetter(false);
  };

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchData();
    }, []);

  const fetchData = async () => {
    const response = await getFeedbacks(token);
    setTransactionsData(response);
  }

  const handleDelete = (feedbackId: string) => {   
    deleteFeedback(feedbackId, token);
    setTransactionsData((prevTransactions) => prevTransactions.filter((feedback) => feedback._id !== feedbackId));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
};

  return (
    <>
    <div className="rounded-lg text-white border border-strokedark bg-tertiary px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
    <div className="flex flex-row justify-between">
      <h4 className="text-title-sm mb-4 font-semibold text-white">
        Transactions
      </h4>
    </div>
    

      <div className="flex flex-col overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-strokedark ">
              {/* Header cells */}
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Date</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Description</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Amount</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Status</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body */}
            {complaintsData.map((complaint, index) => (
              <tr key={complaint._id} onClick={toggleSidebar} className={`border-b border-strokedark  ${index === 0 ? 'rounded-t-sm' : ''}`}>
                <td className="p-2.5  xl:p-5">{complaint.user?.name}</td>
                <td className="p-2.5  xl:p-5">{complaint.title}</td>
                <td className="p-2.5  xl:p-5">{complaint.description}</td>
                <td className="p-2.5  xl:p-5">{formatDatetime(complaint.createdAt)}</td>
                <td className="p-2.5 xl:p-5 ">
                  <div className="flex flex-row gap-4">
                 
                    <button
                      onClick={() => showDeleteConfirmation(complaint._id)}
                      className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Delete
                    </button>
                    {isDeleteConfirmationVisible && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-tertiary p-5 rounded-lg shadow-md">
                          <p>Are you sure you want to delete this feedback?</p>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={hideDeleteConfirmation}
                              className="mr-4 rounded bg-primary py-2 px-3 text-white hover-bg-opacity-90"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                hideDeleteConfirmation();
                                handleDelete(feedbackToDeleteId);
                              }}
                              className="rounded bg-danger py-2 px-3 text-white hover-bg-opacity-90"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {isSidebarOpen && (
            <div className="fixed right-0 h-screen border-l border-lime-800 w-full lg:w-[33%] text-white z-500 bg-opacity-50">
                <div className="bg-[#01431D] h-screen p-5 flex flex-col">
                    <div className="flex justify-end">
                        <button     
                            className="border-2 border-white mb-5 rounded-lg p-3 w-20 hover:bg-white hover:text-[#01431D] transition duration-300 ease-in-out"
                            onClick={toggleSidebar}
                        >
                            {/* <FontAwesomeIcon icon={faXmark} className="h-6 w-6" /> */}Close
                        </button>
                    </div>
                    <div>
                        <p className="text-2xl mb-4">Ask me anything about Climate Change, Clean Energy and Sustainability</p>
                    </div>

                    <div className="mt-4">
                        <textarea  
                            placeholder="What is climate change?" 
                            className="w-full p-2 border rounded text-black outline-none"
                        />
                    </div>
                    {/* Chat interface goes here */}
                    <div className="flex flex-col h-full">
                        <div className="flex-grow overflow-y-auto">
                            {/* Chat messages will be displayed here */}
                        </div>
                        
                    </div>
                </div>
            </div>
            )}
    </>
  );
};

export default TransactionsTable;






