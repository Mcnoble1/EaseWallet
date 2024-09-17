import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../utils/AppContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import SendMoney from '../../components/SendMoney';
import 'react-toastify/dist/ReactToastify.css';
import '../signin.css';

const Categories: React.FC = () => {
  const { userId } = useContext(AppContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
    if (!userId) {
      navigate('/');
    }
  };
  validateUser();
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
                <Breadcrumb pageName="Send Money" /> 
              </div>

              <div className="w-full">
                 <SendMoney />
              </div>
              </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Categories;
