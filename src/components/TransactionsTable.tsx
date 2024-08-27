import React, { useState, useRef, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'; 
import { getFeedbacks, deleteFeedback } from '../api/feedbackApi';
import { formatDatetime } from '../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCaretDown, faCaretUp, faFileAlt, faCoins, faCaretRight } from '@fortawesome/free-solid-svg-icons';

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
  const [showTransactionDetails, setShowTransactionDetails] = useState(true);
  const [showTransferDetails, setShowTransferDetails] = useState(true);
  const [showTransactionTimeline, setShowTransactionTimeline] = useState(true);

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
                <tr key={complaint._id} onClick={toggleSidebar} className={`border-b border-strokedark ${index === 0 ? 'rounded-t-sm' : ''}`}>
                  <td className="p-2.5 xl:p-5">{complaint.user?.name}</td>
                  <td className="p-2.5 xl:p-5">{complaint.title}</td>
                  <td className="p-2.5 xl:p-5">{complaint.description}</td>
                  <td className="p-2.5 xl:p-5">{formatDatetime(complaint.createdAt)}</td>
                  <td className="p-2.5 xl:p-5">
                    <div className="flex flex-row gap-4">
                      <button
                        onClick={() => showDeleteConfirmation(complaint._id)}
                        className="rounded py-2 px-3 text-white hover:bg-opacity-90"
                      >
                        <FontAwesomeIcon icon={faCaretRight} className='ease-in'/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed right-0 top-0 ease-in h-screen border-l border-lime-800 w-full lg:w-[25%] text-white z-9999  bg-opacity-50">
      <div className="bg-white h-screen p-5 flex flex-col text-black overflow-y-auto">
        <div className="flex justify-end">
          <FontAwesomeIcon 
            onClick={toggleSidebar} 
            icon={faXmark} 
            className="h-6 w-6 hover:bg-gray-200 cursor-pointer" 
          />
        </div>
        
        {/* Summary Card */}
        <div className="bg-blue-600 text-black p-4 rounded-lg shadow-md mb-4 flex flex-col items-center">
          <FontAwesomeIcon icon={faCoins} className="text-whit text-4xl mb-2" />
          <p className="text-lg font-semibold text-center">Withdrawal to Community Federal Savings Bank (0372)</p>
          <p className="text-2xl font-bold mt-2">-3,497.00 USD</p>
          <p className="text-gray-300">Completed</p>
          <p className="text-gray-300 mt-1">17 Jun 2024</p>
        </div>

        {/* Transaction Details Dropdown */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowTransactionDetails(!showTransactionDetails)}
          >
            <p className="text-lg font-semibold">Transaction details</p>
            <FontAwesomeIcon icon={showTransactionDetails ? faCaretUp : faCaretDown} />
          </div>
          {showTransactionDetails && (
            <div className="mt-2">
              <p>Transaction ID: 693935673</p>
              {/* Other details */}
            </div>
          )}
        </div>

        {/* Transfer Details Dropdown */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowTransferDetails(!showTransferDetails)}
          >
            <p className="text-lg font-semibold">Transfer details</p>
            <FontAwesomeIcon icon={showTransferDetails ? faCaretUp : faCaretDown} />
          </div>
          {showTransferDetails && (
            <div className="mt-2">
              <p>Transfer ID: 4366184477081050</p>
              <p>Transfer amount: 3427.06 USD</p>
              <p>Fee: 69.94 USD</p>
              <p className="text-gray-500 text-sm">A transfer might include multiple transactions to the same bank account</p>
            </div>
          )}
        </div>

        {/* Transaction Timeline Dropdown */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowTransactionTimeline(!showTransactionTimeline)}
          >
            <p className="text-lg font-semibold">Transaction timeline</p>
            <FontAwesomeIcon icon={showTransactionTimeline ? faCaretUp : faCaretDown} />
          </div>
          {showTransactionTimeline && (
            <div className="mt-2">
              <p>Estimated deposit date: 18 Jun 2024*</p>
              <p>Sent to bank: 18 Jun 2024</p>
              <p>Approved: 17 Jun 2024</p>
              <p>Under review: 17 Jun 2024</p>
              <p className="text-gray-500 text-sm">*In certain cases, a transaction may take longer than described above...</p>
            </div>
          )}
        </div>

        {/* Confirmation Button */}
        <button className="bg-blue-600 text-whit py-2 rounded-lg mt-auto flex items-center justify-center">
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          GET CONFIRMATION
        </button>
      </div>
    </div>
      )}
    </>
  );
};

export default TransactionsTable;
