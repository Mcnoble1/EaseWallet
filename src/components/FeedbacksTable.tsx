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

const ComplaintsTable: React.FC = ({ onClick }) => {
  const [complaintsData, setComplaintsData] = useState<Complaint[]>([]);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [feedbackToDeleteId, setFeedbackToDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [sortPopupOpen, setSortPopupOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  let filterOptions = ['Good Review', 'Bad Review', 'Suggestion', 'Wrong Information', 'Feature Request', 'App Crash Report', 'Others'];

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

  const handleSearch = async (e) => {
    e.preventDefault(); 
      setLoading(true);
      const response = await searchFeedbacks(search, token); 
      setComplaintsData(response);
      setSearch('');
      setLoading(false); 
  };

  useEffect(() => {
    fetchData();
    }, []);

  const fetchData = async () => {
    const response = await getFeedbacks(token);
    setComplaintsData(response);
  }

  const handleDelete = (feedbackId: string) => {   
    deleteFeedback(feedbackId, token);
    setComplaintsData((prevComplaints) => prevComplaints.filter((feedback) => feedback._id !== feedbackId));
  };


  const handleSort = (option: string) => {
    let sortedData = [...complaintsData];
    if (option === 'ascending') {
      sortedData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === 'descending') {
      sortedData.sort((a, b) => b.title.localeCompare(a.title));
    } else if (option === 'date') {
      sortedData.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
  
    setSortOption(option);
    setSortDropdownVisible(false); // Close the dropdown
    setComplaintsData(sortedData);
  };

  const handleFilter = (option: string) => {
    let filteredData = [];
    filterOptions.map((filterOption) => {
      if (option === filterOption) {
        filteredData = complaintsData.filter((complaint) => complaint.title === filterOption);
      } else if (option === '') {
        fetchData();
      }
    });
    
    setFilterOption(option);
    setFilterDropdownVisible(false); // Close the dropdown
    setComplaintsData(filteredData);
  };

  const handleSortChange = (event) => {
    // setSortOrder(event.target.value);
  };

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
    setCountry('');
    setStartDate('');
    setEndDate('');
  };

  // const handleFilter = () => {
  //   setLoading(true);
  //   // Assuming you have a function to fetch or filter your data
  //   fetchFilteredData(filterOption, country, startDate, endDate)
  //     .then(() => {
  //       setLoading(false);
  //       setFilterPopupOpen(false);
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //     });
  // };

  // const fetchFilteredData = (filterOption, country, startDate, endDate) => {
  //   // Replace this with your actual data fetching/filtering logic
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log(`Data filtered by: ${filterOption}, Country: ${country}, Start Date: ${startDate}, End Date: ${endDate}`);
  //       resolve();
  //     }, 1000);
  //   });
  // };

  const exportToExcel = () => {
    const tableData = [
      ['Type of Complaint', 'Complaint', 'Issuer', 'Date of Complaint'],
      ...complaintsData.map((complaint) => [
        complaint.title,
        complaint.description,
        complaint.user?.name || '',
        formatDatetime(complaint.createdAt),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FeedbacksTable');
    XLSX.writeFile(wb, 'feedbacks_table.xlsx');
  };

  return (
    <div className="rounded-lg text-white border border-strokedark bg-tertiary px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
    <div className="flex flex-row justify-between">
      <h4 className="text-title-sm mb-4 font-semibold text-white">
        Transactions
      </h4>
     
      <div className="flex gap-2">
      <div className="relative">
        <button
          onClick={() => setSortPopupOpen(!sortPopupOpen)}
          className="inline-flex items-center justify-center rounded-full border border-white bg-secondary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Sort by
        </button>
        {sortPopupOpen && (
          <div
            ref={popup}
            className="fixed inset-0 flex items-center justify-center z-50 bg-tertiary bg-tertiary/90"
          >
            <div className="bg-tertiary rounded-lg p-4 shadow-md border">
              <div className="flex flex-row justify-between">
                <h2 className="text-xl text-white font-semibold">Sort</h2>
                <div className="flex justify-end">
                  <button
                    onClick={() => closePopup(setSortPopupOpen)}
                    className="text-blue-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-current bg-white rounded-full p-1 hover:bg-opacity-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="black"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form>
                <div className="rounded-sm bg-tertiary">
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                      <label className="mb-3 block text-white">Sort by</label>
                      <select
                        name="sortOrder"
                        onChange={handleSortChange}
                        required
                        className="rounded-lg border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="">Select a Sort Order</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </select>
                    </div>
                    {/* Add more select fields as needed */}
                  </div>
                </div>
              </form>

              <button
                type="button"
                onClick={handleSort}
                disabled={loading}
                className="ml-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-8"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-t-2 border-primary border-solid rounded-full animate-spin" />
                    <span>Sorting...</span>
                  </div>
                ) : (
                  <>Sort</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>


      <div className="relative">
      <button
        onClick={() => setFilterPopupOpen(!filterPopupOpen)}
        className="inline-flex items-center justify-center rounded-full bg-tertiary border border-white py-3 px-10 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10"
      >
        Filter
      </button>
      {filterPopupOpen && (
        <div
          ref={popup}
          className="fixed inset-0 flex items-center justify-center z-50 bg-tertiary bg-tertiary/90"
        >
          <div className="bg-tertiary rounded-lg p-4 shadow-md border">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-semibold">Filter By</h2>
              <div className="flex justify-end">
                <button
                  onClick={() => closePopup(setFilterPopupOpen)}
                  className="text-blue-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-current bg-white rounded-full p-1 hover:bg-opacity-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form>
              <div className="rounded-sm bg-tertiary">
                <div className="flex flex-col gap-5.5 p-6.5">
                  <div>
                    <label className="mb-3 block text-white">Filter by</label>
                    <select
                      name="filterOption"
                      onChange={handleFilterOptionChange}
                      required
                      className="rounded-lg w-full border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select a Filter Option</option>
                      <option value="country">Country</option>
                      <option value="date">Date</option>
                    </select>
                  </div>

                  {filterOption === 'country' && (
                    <div>
                      <label className="mb-3 block text-white">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="rounded-lg border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  )}

                  {filterOption === 'date' && (
                    <div className="flex flex-row gap-5.5">
                      <div>
                        <label className="mb-3 block text-white">From Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="rounded-lg border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-3 block text-white">To Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                          className="rounded-lg border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>

            <button
              type="button"
              onClick={handleFilter}
              disabled={loading}
              className="ml-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-8"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 border-t-2 border-primary border-solid rounded-full animate-spin" />
                  <span>Filtering...</span>
                </div>
              ) : (
                <>Filter</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>

      </div>
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
      <button
        type="button"
        onClick={exportToExcel}
        // Close popup on second page
        className="mr-5 mb-5 mt-5 inline-flex items-center justify-center border border-white gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      >
        Export to Excel
      </button>
    </div>
  );
};

export default ComplaintsTable;






