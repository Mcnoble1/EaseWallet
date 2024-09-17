import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../utils/AppContext';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CardOne from '../components/CardOne.tsx';
import Greeting from '../components/Greeting.tsx';
import Wallet from '../components/Balance.tsx';
import TransactionsTable from '../components/TransactionsTable.tsx';
const Dashboard = () => {
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
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className='w-full flex flex-col lg:flex-row gap-5 mb-5'>
              <Greeting />
              <Wallet user={"id"}/>
            </div>
          
            <h2 className='text-center text-2xl text-white font-bold mb-5 mt-5'>Trending PFIs</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
              <CardOne />
            </div>

            <div className="mt-4">
            <TransactionsTable /> 
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
