import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import axios from 'axios'; // You may need to install axios
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface Category {
  _id: number;
  image: string;
  name: string;
  service: Array<string>;
  createdAt: string;
  updatedAt: string;
}

const Categories: React.FC = () => {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<number | null>(null);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>(''); 
  const [filterOption, setFilterOption] = useState<string>(''); 
  const [servicePopupOpen, setServicePopupOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});
  const [formData, setFormData] = useState<{ name: string; image: File | null }>({
    name: '',
    image: null,
  });

  const trigger = useRef<HTMLDivElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showDeleteConfirmation = (categoryId: number) => {
    setCategoryToDeleteId(categoryId);
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setCategoryToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };
  
  const togglePopup = (categoryId: any) => {
    categoriesData.map((category) => { 
      if (category._id === categoryId) {
        setFormData({
          name: category.name,
          image: null,
        });
      }
    });
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [categoryId]: !prevMap[categoryId],
    }));
  };

  // Function to close the popup for a specific category
  const closePopup = (categoryId: any) => {
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [categoryId]: false,
    }));
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

  if (name === 'name' || name === 'image')  {
      // Use a regular expression to allow only letters~ and spaces
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

    const file = e.target.files?.[0];

    if (file) {
      setSelectedFileName(file.name);
    }
  };


  const url = "https://madad.onrender.com/api/admin/configuration/get-categories";
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
    fetchData(); // Load data when the component mounts
  }, []);

  const fetchData = () => {
    axios.get<Category[]>(url, config)
      .then((response) => {
        setCategoriesData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSearch = async (e) => {
    e.preventDefault(); 
  
    try {
      setLoading(true); // Set loading state to true

      const url = "https://madad.onrender.com/api/admin/configuration/search-category";
      const token = localStorage.getItem('token') || '';

      const data = new URLSearchParams();
      data.append("search", search);
  
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
  
      const response = await axios.post(url, data, config);
      setCategoriesData(response.data.result);
      setSearch('');
    } catch (error) {
      toast.error(`${search} does not exist`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Adjust the duration as needed
      });   
      setLoading(false); 
    }
  };

  const handleEdit = (categoryId: number ) => {
    // setLoading(true);
    try {

    const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("image", fileInputRef.current.files[0], fileInputRef.current?.files[0].name);

    const url = `https://madad.onrender.com/api/admin/configuration/update-category/${categoryId}`;
    axios
    .put(url, formdata, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        toast.success('Category updated successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Adjust the duration as needed
        });
        // setLoading(false);
        closePopup(categoryId);

      // fetch the categorys data table again
      fetchData();
       
    
        setCategoriesData((prevCategories) => [...prevCategories, response.data.category]);


        setSelectedCategory(null); // Close the options menu
      })
    } catch (error) {
      toast.error("Add the category Image, try again!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Adjust the duration as needed
      });
      // setLoading(false);
    } 
  };

  const handleDelete = (categoryId: number) => {
    // Handle delete action
    const config = {
      method: 'delete',
      url: `https://madad.onrender.com/api/admin/configuration/delete-category/${categoryId}`,
      headers: {
        'Authorization': `Bearer ${token}`, // Include the bearer token in the Authorization header
      },
    };
    
    axios(config)
      .then(function (response) {
        toast.success('Category deleted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000, // Adjust the duration as needed
        });

        setCategoriesData((prevCategories) => [...prevCategories, response.data.category]);

        setCategoriesData((prevCategories) => prevCategories.filter((category) => category._id !== categoryId));
        setSelectedCategory(null); 
      })
      .catch(function (error) {
        toast.error('Could not delete category, try again', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
        });      
      });
  };

  const toggleOptions = (category: Category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="rounded-lg border border-strokedark bg-tertiary px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
       <div className="flex flex-row justify-between">
      <h4 className="text-title-sm mb-4 font-semibold text-white">
        Categories
     </h4>
     <div className="hidden sm:block flex flex-row justify-center">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <button className="absolute top-1/2 left-0 -translate-y-1/2">
                <svg
                  className="fill-bodydark hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
              </button>

              <input
                type="text"
                placeholder="Search Categories..."
                className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>
      <div className="flex gap-2">
      </div>
      </div>
      <div className="grid grid-cols-6 gap-4 py-10">
        {categoriesData.map((category) => (
          <div key={category._id} className="relative">
            <div
              className="flex flex-col items-center justify-center bg-[#1B2952] rounded-lg p-4 cursor-pointer"
              ref={trigger}
              onClick={() => togglePopup(category._id)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-20 h-20 object-cover rounded-full"
              />
              <h5 className="text-sm font-semibold text-white mt-2">{category.name}</h5>
            </div>

            {popupOpenMap[category._id] && (
                <div
                  ref={popup}
                  className="fixed inset-0 mt-15 flex items-center justify-center z-50 bg-tertiary bg-tertiary/90"
                >
                  <div className="bg-tertiary rounded-lg p-4 shadow-md border w-[40%]">
                    <div className="flex flex-row justify-between">
                      <h2 className="text-xl text-white font-semibold">{category.name} services</h2>
                      <div className="flex justify-end">
                        <button
                          onClick={() => closePopup(category._id)}
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

                    
                    {category.service?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4 px-5 py-10">
                      {category.service.map((service) => (
                        <div className="flex flex-col items-center justify-center bg-[#1B2952] rounded-lg p-4 cursor-pointer">                      
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-20 h-20 object-cover rounded-full"
                        />
                        <h5 className="text-sm font-semibold text-white mt-2">{service.name}</h5>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <p className='py-10 px-10'>
                      No services available for this category yet
                    </p>
                  )}


                    
                      
                  </div>
                </div>
              )}
          </div>  
        ))}
         
    </div>
    </div>
  );
};

export default Categories;
