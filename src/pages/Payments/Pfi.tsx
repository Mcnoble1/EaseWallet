import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { faDollarSign, faPiggyBank, faCreditCard, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import VehiclesTable from '../../components/TransportationTable';
import { fetchAreas, fetchBlocks, fetchLandmarks } from '../../api/configurationApi';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../signin.css';

interface Area {
  _id: string;
  area: string;
}

interface Landmark {
  _id: string;
  landmark: string;
}

interface Block {
  _id: string;
  block: number;
}

const PFIs = [
  {
    did: 'did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y',
    name: 'AquaFinance Capital',
    description: 'Provides exchanges with the Ghanaian Cedis: GHS to USDC, GHS to KES',
    icon: faDollarSign,
    backgroundColor: '#1e3a8a' // Navy Blue
  },
  {
    did: 'did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy',
    name: 'Flowback Financial',
    description: 'Offers international rates with various currencies - USD to GBP, GBP to CAD.',
    icon: faPiggyBank,
    backgroundColor: '#065f46' // Dark Green
  },
  {
    did: 'did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y',
    name: 'Vertex Liquid Assets',
    description: 'Offers exchange rates with the South African Rand: ZAR to BTC and EUR to ZAR.',
    icon: faCreditCard,
    backgroundColor: '#b91c1c' // Dark Red
  },
  {
    did: 'did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o',
    name: 'Titanium Trust',
    description: 'Offers exchange rates with the South African Rand: ZAR to BTC and EUR to ZAR.',
    icon: faChartLine,
    backgroundColor: '#4a5568' // Dark Gray
  }
];

const Tables = () => {
    const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [landmarksData, setLandmarksData] = useState<Landmark[]>([]);
  const [blocksData, setBlocksData] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [dropoffareas, setDropoffareas] = useState<Area[]>([]); 
  const [selectedDropoffarea, setSelectedDropoffarea] = useState<Area | null>(null);
  const [selectedLandmarks, setSelectedLandmarks] = useState<any[]>([]);

  const [pickupInstances, setPickupInstances] = useState<
  Array<{ area: string; block: string }>
>([
  { area: '', block: '' },
]);

const [dropoffInstances, setDropoffInstances] = useState<
  Array<{ area: string; landmark: string[] }>
>([{ area: '', landmark: [] }]);

const { did } = useParams();
const pfi = PFIs.find((pfi) => pfi.did === did);

const addPickupAreaBlockInstance = () => {
  setPickupInstances([...pickupInstances, { area: '', block: '' }]);
};

const addDropoffAreaLandmarkInstance = () => {
  setDropoffInstances([...dropoffInstances, { area: '', landmark: [] }]);
};

  const [formData, setFormData] = useState<{ 
    driver: string; 
    phone: string; 
    company: string; 
    dropoffarea: string[]; 
    dropofflandmark: string[]; 
    whatsapp: string; 
    vehicle: string; 
    pickuparea: string[]; 
    pickupblock: string[];  
    image: File | null;
  }>({
    driver: '',
    phone: '',
    company: '',
    whatsapp: '',
    vehicle: '',
    pickuparea: [], 
    pickupblock: [], 
    dropoffarea: [], 
    dropofflandmark: [], 
    image: null,
  });

  useEffect(() => {
    // Check if the user is signed in, otherwise redirect to the sign-in page
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await axios.get('https://madad.onrender.com/api/admin/login', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status !== 200) {
          // navigate('/signin');
        } 
      } catch (error) {
        // navigate('/signin');
        console.error('Error:', error);
        // Handle the error
      }
    };
    validateToken();
    
  }, [navigate]);

  const trigger = useRef<HTMLDivElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showSuccessNotification = () => {
    toast.success('Vehicle created successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 6000, // Adjust the duration as needed
    });
  };

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchData(); // Load data when the component mounts
  }, []);


  const fetchData = async () => {
    const response = await fetchAreas(token);
    setDropoffareas(response.data);  
    const response2 = await fetchLandmarks(token);
    setLandmarksData(response2.data);
    const response3 = await fetchBlocks(token);
    setBlocksData(response3.data);
  };




  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!popupOpen || keyCode !== 27) return;
      setPopupOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [popupOpen]);
  

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const file = e.target.files?.[0];

    if (file) {
      setSelectedFileName(file.name);
    }
  
    if (name === 'phone' || name === 'whatsapp') {
      // Use a regular expression to allow only phone numbers starting with a plus
      const phoneRegex = /^[+0-9\b]+/;
  
      if (!value.match(phoneRegex) && value !== '') {
        // If the input value doesn't match the regex and it's not an empty string, do not update the state
        return;
      }
    } else if (
      name === 'driver' ||
      name === 'company' ||
      name === 'vehicle'
    ) {
      // Use a regular expression to allow only letters and spaces
      const letterRegex = /^[A-Za-z\s]+/;
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

  const handleLandmarkChange = (selectedOptions: any, instanceIndex: number) => {
    setSelectedLandmarks(selectedOptions);
    setDropoffInstances((prevInstances) =>
      prevInstances.map((instance, index) =>
        index === instanceIndex
          ? { ...instance, landmark: selectedOptions.map((option: any) => option.value) }
          : instance
      )
    );
  };

  const handleAddVehicle = async (e: FormEvent) => {
    e.preventDefault();

      // Validate the form fields
  const requiredFields = ['driver', 'company', 'phone', 'whatsapp', 'vehicle', 'pickuparea', 'pickupblock', 'dropoffarea', 'dropofflandmark'];
  const emptyFields = requiredFields.filter((field) => !formData[field]);

  if (emptyFields.length > 0) {
    toast.error('Please fill in all required fields.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Adjust the duration as needed
    });
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        // Find the corresponding input element and add the error class
        const inputElement = document.querySelector(`[name="${field}"]`);
        if (inputElement) {
          inputElement.parentElement?.classList.add('error-outline');
        }
      }
    });

    return; // Prevent form submission
  }

    // Create a FormData object
    const formdata = new FormData();
    formdata.append("driver", formData.driver);
    formdata.append("phone", formData.phone);
    formdata.append("company", formData.company);
    formdata.append("whatsapp", formData.whatsapp);
    formdata.append("vehicle", formData.vehicle);   
    for (let i = 0; i < pickupInstances.length; i++) {
      formdata.append("pickuparea[]", pickupInstances[i].area);
    };
    for (let i = 0; i < pickupInstances.length; i++) {
      formdata.append("pickupblock[]", pickupInstances[i].block);
    };
    for (let i = 0; i < dropoffInstances.length; i++) {
      formdata.append('dropoffarea[]', dropoffInstances[i].area);
      formdata.append('dropofflandmark[]', dropoffInstances[i].landmark);
    }
    formdata.append("image", fileInputRef.current.files[0], fileInputRef.current?.files[0].name);

    try {
    setLoading(true); 
    const url = "https://madad.onrender.com/api/admin/transportation/create";
    const token = localStorage.getItem('token') || '';

    axios
      .post(url, formdata, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setPopupOpen(false);
    if (response.status === 200) {
      showSuccessNotification();

      // Reload the page
      window.location.reload();


    } else {
      setLoading(false);
    }
  })
  } catch (error) {
    toast.error('Failed to create vehicle. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, 
    });
  } finally { 
  } 

  };

  return (
    <div className="bg-primary">
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className='text-white text-center'>
              <h1 className='text-3xl font-bold'>{pfi.name}</h1>
              <p className='text-xl'>{pfi.description}</p>
            </div>
          <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb pageName="Registered Vehicles" />
            <button ref={trigger}
            onClick={() => setPopupOpen(!popupOpen)}
            className="inline-flex items-center justify-center rounded-full bg-secondary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
            Add Vehicle
            </button>
        </div>

      {popupOpen && (
        <div
          ref={popup}
          className="fixed inset-0 flex items-center justify-center z-50 bg-tertiary bg-tertiary/90"
          >
          <div
              className="bg-tertiary rounded-lg p-4 shadow-md border"
              style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
            >              
                <div className="flex flex-row justify-between">
                <h2 className="text-xl font-semibold mb-4">Add Vehicle</h2>
                <div className="flex justify-end">
                  <button
                    onClick={() => setPopupOpen(false)}
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
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-white">
                        Name of the Driver
                      </label>
                      <div className={`relative ${formData.driver ? 'bg-light-blue' : ''}`}>
                      <input
                        type="text"
                        placeholder="Alan Smith"
                        name="driver"
                        value={formData.driver}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-white"
                      />
                      </div>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-white dark:text-white">
                        Phone Number
                      </label>
                      <div className={`relative ${formData.phone ? 'bg-light-blue' : ''}`}>
                      <input
                        type="text"
                        placeholder="+1 123 456 7890"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-white"
                      />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-white dark:text-white">
                        Name of the Company
                      </label>
                      <div className={`relative ${formData.company ? 'bg-light-blue' : ''}`}>
                      <input
                        type="text"
                        placeholder="Max Transport"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-white"
                      />
                      </div>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-white dark:text-white">
                        Whatsapp No
                      </label>
                      <div className={`relative ${formData.whatsapp ? 'bg-light-blue' : ''}`}>
                      <input
                        type="text"
                        placeholder="+1 123 456 7890"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-white"
                      />
                      </div>
                    </div>
                  </div>

                 
            
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  

                    <div className="w-full xl:w-2/2">
                      <label className="mb-2.5 block text-white dark:text-white">
                        Type of the Vehicle
                      </label>
                      <div className={`relative ${formData.vehicle ? 'bg-light-blue' : ''}`}>
                      <select
                          name="vehicle"
                          value={formData.vehicle}
                          onChange={handleInputChange}
                          required
                          placeholder="Yes"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                          <option value="">Select Vehicle Type</option>
                          <option value="Car">Car</option>
                          <option value="Coaster">Coaster</option>
                          <option value="Van">Van</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* <div className="mb-4.5 flex flex-col gap-3">           
                      <label className="mb-2.5 block text-white dark:text-white">
                          Vehicle Image
                      </label>
                      <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-white bg-tertiary py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleInputChange}
                          required
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-5 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                          
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p>
                            <span className="text-white">
                            {selectedFileName ? selectedFileName : 'Click to add Image'}                            
                            </span> 
                          </p>
                        </div>
                      </div> 
                    </div> */}
                  
                 <div className="mb-4.5">
                {pickupInstances.map((instance, index) => (
                  <div key={index} className="flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-3/7">
                      <label className="mb-2.5 block text-white dark:text-white">
                        { index === 0 ? 'Pickup Area' : `Pickup Area ${index + 1}`}
                      </label>
                      <div className={`relative ${instance.area ? 'bg-light-blue' : ''}`}>
                        <select
                          name={`pickuparea-${index}`}
                          value={instance.area}
                          onChange={(e) => {
                            const updatedInstances = [...pickupInstances];
                            updatedInstances[index].area = e.target.value;
                            setPickupInstances(updatedInstances);
                          }}
                          required
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"
                        >
                          <option value="">Select Pickup Area</option>
                          {Object.keys(dropoffareas).map((area) => (
                            <option key={area._id} value={area.area}>
                              {area.area}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="w-full xl:w-3/7 mb-5">
                      <label className="mb-2.5 block text-white dark:text-white">
                      { index === 0 ? 'Pickup Block' : `Pickup Block ${index + 1}`}
                      </label>
                      <div className={`relative ${instance.block ? 'bg-light-blue' : ''}`}>
                        <select
                          name={`pickupblock-${index}`}
                          value={instance.block}
                          onChange={(e) => {
                            const updatedInstances = [...pickupInstances];
                            updatedInstances[index].block = e.target.value;
                            setPickupInstances(updatedInstances);
                          }}
                          required
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"
                        >
                          <option value="">Select Pickup Block</option>
                          {instance.area &&
                            [...Array(pickupAreasData[instance.area]).keys()].map((block) => (
                              <option key={block} value={block + 1}>
                                {block + 1}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end xl:w-1/7">
                    <button
                      type="button"
                      onClick={addPickupAreaBlockInstance}
                      className="text-blue-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 fill-current bg-primary rounded-full p-1 hover:bg-opacity-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                      >
                        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                  </div>
                ))}             
              </div>             

                  <div className="mb-4.5">
                      {dropoffInstances?.map((instance, index) => (
                        <div key={index} className="flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-3/7">
                          <label className="mb-2.5 block text-white dark:text-white">
                            {index === 0 ? 'Area' : `Area ${index + 1}`}
                          </label>
                          <div className={`relative ${instance.area ? 'bg-light-blue' : ''}`}>
                            <select
                              name={`dropoffarea-${index}`}
                              value={instance.area}
                              onChange={(e) => {
                                const updatedInstances = [...dropoffInstances];
                                updatedInstances[index].area = e.target.value;
                                setDropoffInstances(updatedInstances);
                                const { value } = e.target;
                                const selectedDropoffareaObject = dropoffareas.find((dropoffarea) => dropoffarea.dropoffarea === value);
  
                                setSelectedDropoffarea(selectedDropoffareaObject || null);
                              }}
                              required
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-white active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"
                            >
                              <option value="">Select Dropoff Area</option>
                              {dropoffareas?.map((dropoffarea) => (
                                <option key={dropoffarea._id} value={dropoffarea.dropoffarea}>
                                  {dropoffarea.dropoffarea}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="w-full xl:w-3/7 mb-5">
                          <label className="mb-2.5 block text-white dark:text-white">
                            Building
                            </label>
                          <div className={`relative ${instance.landmark ? 'bg-light-blue' : ''}`}>
                            <Select
                                  isMulti
                                  name={`dropofflandmark-${index}`}
                                  value={instance.landmark.label}
                                  onChange={(selectedOptions) => handleLandmarkChange(selectedOptions, index)}
                                  options={selectedDropoffarea?.dropofflandmark.map((dropofflandmark) => ({
                                    value: dropofflandmark.dropofflandmark,
                                    label: dropofflandmark.dropofflandmark,
                                  }))}
                                  placeholder="Select landmark(s)"  

                                />
                              </div>
                        </div>

                        <div className="flex justify-end xl:w-1/7">
                          <button
                            type="button"
                            onClick={addDropoffAreaLandmarkInstance}
                            className="text-blue-500 hover:text-gray-700 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 fill-current bg-primary rounded-full p-1 hover:bg-opacity-90"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white" 
                            >
                              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      ))}
                    </div>
                  
                  
              </div>
              </form>

                  <button
                    type="button"
                    onClick={handleAddVehicle} 
                    // Close popup on second page
                    disabled={loading}
                    className="mr-5 lg:mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                  >
                    {loading ? (
                          <div className="flex items-center">
                            <div className="w-6 h-6 border-t-2 border-primary border-solid rounded-full animate-spin" />
                            <span>Creating...</span>
                          </div>
                        ) : (
                          <>Add Vehicle</>
                        )}
                  </button>
          
            </div>
        </div>
      )}

      <div className="flex flex-col gap-10">
        <VehiclesTable />
      </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
};

export default Tables;     