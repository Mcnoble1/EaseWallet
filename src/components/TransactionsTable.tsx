import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { getFeedbacks, searchFeedbacks, deleteFeedback } from '../api/feedbackApi';
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

  return (
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
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Workers</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Type of Complain</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Complaint</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Date of Complaint</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body */}
            {complaintsData.map((complaint, index) => (
              <tr key={complaint._id} className={`border-b border-strokedark  ${index === 0 ? 'rounded-t-sm' : ''}`}>
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
  );
};

export default TransactionsTable;






