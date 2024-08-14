import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { DidDht } from '@web5/dids'
import Header from '../components/Header.tsx';
import Sidebar from '../components/Sidebar.tsx';
import CardOne from '../components/CardOne.tsx';
import CardThree from '../components/CardThree.tsx';
import welcome from '../images/user/welcome.svg';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDid, setUserDid] = useState<any>("");

  useEffect(() => {
    initializeDid();
  }, []);

  const initializeDid = async () => {
    try {
      // Make sure to use a more secure Key Manager in production. More info: https://developer.tbd.website/docs/web5/build/decentralized-identifiers/key-management
      const storedDid = localStorage.getItem('userDid');
      if (storedDid) {
        const did = await DidDht.import({ portableDid: JSON.parse(storedDid) });
        setUserDid(did.uri);
      } else {
        const did = await DidDht.create({ options: { publish: true } });
        const exportedDid = await did.export();
        localStorage.setItem('userDid', JSON.stringify(exportedDid));
      }
    } catch (error) {
      console.error('Failed to initialize DID:', error);
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
          <div className="flex h-25 justify-between rounded-lg bg-tertiary py-3 px-7.5 shadow-default">
            <div className="flex justify-between">
              <div>
                <p className="text-white text-lg font-bold">Good Morning {userDid}</p>
              </div>
            </div>
            
            <div className="flex h-22">
              <img src={welcome} alt="Welcome" />
            </div>
          </div>
            <h2 className='text-center text-2xl text-white font-bold mb-5 mt-5'>Your Credentials</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
              <CardOne />
            </div>

            <div className="mt-4">
             
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
};

export default Profile;



