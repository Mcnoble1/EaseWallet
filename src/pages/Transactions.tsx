import React, { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import TransactionsTable from '../components/FeedbacksTable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './signin.css';


const Tables: React.FC = () => {
    const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<{ name: string; dateofbirth: string; gender: string; phone: string; whatsapp: string; area: string; block: string; nationality: string; category: string; service: string[]; languages: string[]; lengthOfService: string; familyInKuwait: string; petFriendly: string; image: File | null }>({
    name: '',
    gender: '',
    phone: '',
    whatsapp: '',
    area: '',
    block: '',
    nationality: '',
    dateofbirth: '',
    languages: [],
    service: [],
    category: '',
    lengthOfService: '',
    familyInKuwait: '',
    petFriendly: '',
    image: null,
  });

  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  // Data for areas and number of blocks
  const areaData = {
    "Bneid Al Gar": 3,
    "Fahaheel": 14,
    "Farwaniya": 6,
    "Hawally": 12,
    "Jabriya": 12,
    "Jleeb": 5,
    "Mangaf": 5,
    "Kuwait City": 15,
    "Rumaithiya": 11,
    "Salmiya": 12,
    "Salwa": 12,
    "Sharq": 8,
    "Khaitan": 10,
    "Others": 0, // You can set this to 0 or any other default value
  };

  // Get the selected area's block count
  const selectedAreaBlocks = areaData[formData.area];

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
  
  const serviceOptions = selectedCategory?.service.map((service) => ({
    value: service._id,
    label: service.name,
  }));

  // Modify the handleServiceChange function
const handleServiceChange = (selectedOptions: any) => {
  setSelectedServices(selectedOptions);
  setFormData((prevData) => ({
    ...prevData,
    service: selectedOptions.map((option: any) => option.value),
  }));
};


  const trigger = useRef<HTMLDivElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showSuccessNotification = () => {
    toast.success('Customer created successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, 
    });
  };


 useEffect(() => {
  const keyHandler = ({ keyCode }: { keyCode: number }) => {
    if (!popupOpen || keyCode !== 27) return;
    setPopupOpen(false);
  };
  document.addEventListener('keydown', keyHandler);
  return () => document.removeEventListener('keydown', keyHandler);
}, [popupOpen]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.get('https://madad.onrender.com/api/admin/configuration/get-categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCategories(response.data.data);
      } else {
        console.error('API request failed:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchCategories();
}, []);

const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  const file = e.target.files?.[0];

    if (file) {
      setSelectedFileName(file.name);
    }

    if (name === 'phone' || name === 'whatsapp' || name === 'dateofbirth') {
      // Use a regular expression to allow only phone numbers starting with a plus
      const phoneRegex = /^[+0-9\b]+$/;
        
      if (!value.match(phoneRegex || !value.includes("+")) && value !== '') {
        toast.error('Number must start with +', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Adjust the duration as needed
        });
        // If the input value doesn't match the regex and it's not an empty string, do not update the state
        return;
      }
    } else if (name === 'name' || name === 'nationality' || name === 'area') {
      // Use a regular expression to allow only letters and spaces
      const letterRegex = /^[A-Za-z\s]+$/;
      if (!value.match(letterRegex) && value !== '') {
        // If the input value doesn't match the regex and it's not an empty string, do not update the state
        return;
      }
    }

  if (name === 'category') {
    // Find the selected category object from the categories array
    const selectedCategoryObject = categories.find((category) => category._id === value);

    setSelectedCategory(selectedCategoryObject || null);

    setFormData((prevData) => ({
      ...prevData,
      service: [], // Clear the selected service
    }));
  }

  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  
  const handleAddCustomer = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start the loading state

    // Validate the form fields
  const requiredFields = ['name', 'gender', 'phone', 'category', 'nationality', 'languages', 'service', 'dateofbirth', 'whatsapp', 'area', 'block', 'lengthOfService', 'familyInKuwait', 'petFriendly'];
  const emptyFields = requiredFields.filter((field) => !formData[field]);

  if (emptyFields.length > 0) {
    toast.error('Please fill in all required fields.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Adjust the duration as needed
    });
    setLoading(false);
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
    formdata.append('name', formData.name);
    formdata.append('gender', formData.gender);
    formdata.append('phone', formData.phone);
    formdata.append('category', formData.category);
    formdata.append('nationality', formData.nationality);
    for (let i = 0; i < formData.languages.length; i++) {
      formdata.append('languages[]', formData.languages[i]);
    } 
    for (let i = 0; i < formData.service.length; i++) {
      formdata.append('service[]', formData.service[i]);
    }
    formdata.append('dateofbirth', formData.dateofbirth);
    formdata.append('whatsapp', formData.whatsapp);
    formdata.append('area', formData.area);
    formdata.append('block', formData.block);
    formdata.append('lengthOfService', formData.lengthOfService);
    formdata.append('familyInKuwait', formData.familyInKuwait);
    formdata.append('petFriendly', formData.petFriendly);
    formdata.append("image", fileInputRef.current.files[0], fileInputRef.current.files[0].name);


    try {
    const url = 'https://madad.onrender.com/api/admin/worker/create';
    const token = localStorage.getItem('token') || '';

     // Make the POST request using Axios
     axios
     .post(url, formdata, {
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'multipart/form-data',
       },
     })
     .then((response) => {
       // Add any success handling logic here
       setPopupOpen(false);
   // Check if the category was successfully created
   if (response.status === 200) {
     showSuccessNotification();

      // Clear the form
      setFormData({
        name: '',
        gender: '',
        phone: '',
        whatsapp: '',
        area: '',
        block: '',
        nationality: '',
        languages: [],
        service: [],
        dateofbirth: '',
        category: '',
        lengthOfService: '',
        familyInKuwait: '',
        petFriendly: '',
        image: null,
      });

      // reload the page
      window.location.reload();


   } else {
     // Handle any other response status codes (e.g., validation errors)
      console.error('Failed to create worker details:', response.data);
      toast.error('Failed to create worker. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000, // Adjust the duration as needed
      });
      setLoading(false);
     }})
 } catch (error) {
   console.error('Error creating Customer:', error);
   // Show an error notification for the API request failure
   toast.error('Failed to create worker. Please try again later.', {
     position: toast.POSITION.TOP_RIGHT,
     autoClose: 5000, // Adjust the duration as needed
   });
    setLoading(false);
 } finally {
  // setLoading(false);
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
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="Transactions" />
                <div className='flex flex-row gap-5'>          
                </div>
              </div>

              <div className="flex flex-col gap-10">
                <TransactionsTable />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Tables;