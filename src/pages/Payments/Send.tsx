import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../signin.css';

const Tables = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);


  return (
    <div className="bg-primary">
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb pageName="Send Money" />
            
        </div>

     
      <div className="flex flex-col gap-10">

      </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
};

export default Tables;     