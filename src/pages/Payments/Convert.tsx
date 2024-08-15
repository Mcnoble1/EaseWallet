import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import AllCategories from '../../components/AllCategories';
import 'react-toastify/dist/ReactToastify.css';
import '../signin.css';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
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
        } 
      } catch (error) {
        console.error('Error:', error);
      }
    };
    validateToken();
    
  }, [navigate]);


  return (
    <div className="bg-primary">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="Convert" /> 
              </div>

              <div className="w-full">
                 <AllCategories />
              </div>
              </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Categories;
