import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import axios from 'axios'; 
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface Notification {
  _id: number;
  content: string;
  category: string;
  title: string;
  createdAt: string;
}

type FormData = {
  title: string;
  category: string;
  content: string;
}

const NotificationsTable: React.FC = () => {
  const [notificationsData, setNotificationsData] = useState<Notification[]>([]);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [notificationToDeleteId, setFeedbackToDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    content: ''
  })

  const trigger = useRef<HTMLDivElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);

  const closePopup = (stateSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    stateSetter(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

     if (name === 'dropoffarea' ) {
      // Use a regular expression to allow only letters and spaces
      const letterRegex = /^[A-Za-z\s]+$/;
      if (!value.match(letterRegex) && value !== '') {
        // If the input value doesn't match the regex and it's not an empty string, do not update the state
        return;
      }
    } 

    setFormData((prevData) => ({
      ...prevData,  
      [name]: value,
    }));

  };

  const showDeleteConfirmation = (notificationId: number) => {
    setFeedbackToDeleteId(notificationId);
    setDeleteConfirmationVisible(true);
  };

  
  const hideDeleteConfirmation = () => {
    setFeedbackToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };


  const url = "https://madad.onrender.com/api/admin/notification/get";
  const token = localStorage.getItem('token') || ''; // Replace '' with your default token if needed
  
  const config = {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token}`, // Include the bearer token in the Authorization header
    },
  };

  const formatDatetime = (datetimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(datetimeString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  useEffect(() => {
    fetchData();
    }, []);

    const fetchData = async () => {
      axios.get<Notification[]>(url, config)
      .then((response) => {
        setNotificationsData(response.data.notification);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleDelete = (notificationId: number) => {
    // Handle delete action
    const config = {
      method: 'delete',
      url: `https://madad.onrender.com/api/admin/notification/delete/${notificationId}`,
      headers: {
        'Authorization': `Bearer ${token}`, // Include the bearer token in the Authorization header
      },
    };
    
    axios(config)
      .then(function (response) {
        toast.success('Feedback deleted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Adjust the duration as needed
        });

        setNotificationsData((prevNotifications) => [...prevNotifications, response.data.notification]);

        setNotificationsData((prevNotifications) => prevNotifications.filter((notification) => notification._id !== notificationId));
      })
      .catch(function (error) {
        // toast.error('Could not delete notification, try again', {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 3000,
        // });      
      });
  };


  const exportToExcel = () => {
    const tableData = [
      ['Notification Title', 'Notification Content', 'Notification Category', 'Notification Push Date'],
      ...notificationsData.map((notification) => [
        notification.title,
        notification.content,
        notification.category,
        formatDatetime(notification.createdAt),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NotificationsTable');
    XLSX.writeFile(wb, 'notifications_table.xlsx');
  };

  return (
    <div className="rounded-lg border text-white border-strokedark bg-tertiary px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
    <div className="flex flex-row justify-between">
      <h4 className="text-title-sm mb-4 font-semibold text-white">
        Notification Manager
      </h4>
      <div className="flex gap-2">
        <div className="relative">
          <button
             ref={trigger}
             onClick={() => setNotificationPopupOpen(!notificationPopupOpen)}
            className="inline-flex items-center justify-center rounded-full border border-white bg-secondary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Create Notification
          </button>    
        </div>
      </div>
      {notificationPopupOpen && (
                <div
                  ref={popup}
                  className="fixed inset-0 mt-15 flex items-center justify-center z-50 bg-tertiary bg-tertiary/90"
                >
                  {/* Dropoffarea Popup Form */}
                  <div className="bg-tertiary rounded-lg p-4 shadow-md border w-[40%]">
                    <div className="flex flex-row justify-between">
                      <h2 className="text-xl font-semibold">Create Notification</h2>
                      <div className="flex justify-end">
                        <button
                          onClick={() => closePopup(setNotificationPopupOpen)}
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
                            <label className="mb-3 block text-white ">
                              Title
                            </label>
                            <div className={`relative ${formData.title ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="block"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                              placeholder="Update on withdrawal fee"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline text-[#213960] transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                            />
                            </div>
                          </div>

                          <div>
                            <label className="mb-3 block text-white ">
                              Category
                            </label>
                            <div className={`relative ${formData.title ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="block"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                              placeholder="Worker"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline text-[#213960] transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                            />
                            </div>
                          </div>

                          <div>
                            <label className="mb-3 block text-white ">
                              Content
                            </label>
                            <div className={`relative ${formData.title ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="block"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                              placeholder="Kuwait City"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-[#E7EDF4] py-3 px-5 font-medium outline text-[#213960] transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                            />
                            </div>
                          </div>                          
                        </div>
                      </div>
                      </form>
                      <button
                        type="button"
                        // onClick={handleAddNotification}
                        disabled={loading}
                        className="ml-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-8"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="w-6 h-6 border-t-2 border-primary border-solid rounded-full animate-spin" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <>Send</>
                        )}
                      </button>
                    
                  </div>
                </div>
              )}
    </div>
    

      <div className="flex flex-col overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-strokedark ">
              {/* Header cells */}
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Title</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Content</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Category</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Push Date</th>
              {/* <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {/* Table body */}
            {notificationsData.map((notification, index) => (
              <tr key={notification._id} className={`border-b border-strokedark  ${index === 0 ? 'rounded-t-sm' : ''}`}>
                <td className="p-2.5  xl:p-5">{notification.title}</td>
                <td className="p-2.5  xl:p-5">{notification.content}</td>
                <td className="p-2.5  xl:p-5">{notification.category}</td>
                <td className="p-2.5  xl:p-5">{formatDatetime(notification.createdAt)}</td>
                {/* <td className="p-2.5 xl:p-5 ">
                  <div className="flex flex-row gap-4">
                 
                    <button
                      onClick={() => showDeleteConfirmation(notification._id)}
                      className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Delete
                    </button>
                    {isDeleteConfirmationVisible && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-5 rounded-lg shadow-md">
                          <p>Are you sure you want to delete this notification?</p>
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
                                handleDelete(notificationToDeleteId);
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
                </td> */}
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

export default NotificationsTable;






