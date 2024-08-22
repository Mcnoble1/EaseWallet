import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CardOne from '../components/CardOne.tsx';
import CardThree from '../components/CardThree.tsx';
import FeedbacksTable from '../components/TransactionsTable.tsx';
const Dashboard = () => {
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
        navigate('/signin');
      } 
    } catch (error) {
      navigate('/signin');
      console.error('Error:', error);
      // Handle the error
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
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <CardThree />
            <h2 className='text-center text-2xl text-white font-bold mb-5 mt-5'>Trending PFIs</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
              <CardOne />
            </div>

            <div className="mt-4">
            <FeedbacksTable /> 
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
