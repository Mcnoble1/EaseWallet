//         <main>
//           <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
//           <div className="flex h-25 justify-between rounded-lg bg-tertiary py-3 px-7.5 shadow-default">
//             <div className="flex justify-between">
//               <div className='inline-flex space-x-3 justify-between'>
//                 <p className="text-white text-lg font-bold">Your DID: {userDid?.slice(0, 20) + "..." + userDid?.slice(-8)}</p>
//                 <button
//                     className="flex gap-2"
//                     onClick={handleCopy}
//                     type="button"
//                   >
//                    <FontAwesomeIcon icon={faCopy} style={{color: "#ffffff",}} />
//                     <div>
//                       {isCopied ? (
//                         <p className="bg-primary text-sm text-white p-1 rounded-3xl">
//                           Copied!
//                         </p>
//                       ) : (
//                         ""
//                       )}
//                     </div>
//                   </button>
//               </div>
//             </div>
   


import { useState, useContext } from 'react';
import { AppContext } from '../utils/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar.tsx';
import Header from '../components/Header.tsx';
import Credentials from '../components/Credentials.tsx';
import welcome from '../images/user/welcome.svg';

const Profile = () => {
  const { userDid, initializeDid } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showDid, setShowDid] = useState(false);
  const [file, setFile] = useState(null); // To store the imported file content

  const handleCopy = () => {
    navigator.clipboard.writeText(userDid);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleExportDID = () => {
    const blob = new Blob([localStorage.getItem('userDid')], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'easewallet-did.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportDID = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target.result;
        try {
          const importedDid = JSON.parse(result);
          localStorage.setItem('userDid', result);
          await initializeDid();
        } catch (error) {
          console.error('Failed to import DID:', error);
        }
      };
      reader.readAsText(file);
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
              <div className="flex h-max justify-between rounded-lg bg-tertiary py-3 px-7.5 shadow-default">
                <div>
                <div className="flex justify-between">
                  <div className='inline-flex space-x-3 justify-between'>
                  <p className="text-white text-lg font-bold">Your DID: {userDid?.slice(0, 20) + "..." + userDid?.slice(-8)}</p>
                  <button
                      className="flex gap-2"
                      onClick={handleCopy}
                      type="button"
                    >
                    <FontAwesomeIcon icon={faCopy} style={{color: "#ffffff",}} />
                      <div>
                        {isCopied ? (
                          <p className="bg-primary text-sm text-white p-1 rounded-3xl">
                            Copied!
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-4">
                      <button
                        className="bg-secondary text-white px-4 py-1 rounded"
                        onClick={handleExportDID}
                      >
                        Export Bearer DID
                      </button>

                      <label className="bg-green text-white px-4 py-1 rounded cursor-pointer">
                        Import Bearer DID
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImportDID}
                        />
                      </label>
                  </div>
                </div>
                
                <div className="flex h-22">
                  <img src={welcome} alt="Welcome" />
                </div>
              </div>

              <h2 className="text-center text-2xl text-white font-bold mb-5 mt-5">
                Your Credentials
              </h2>
              <div>
                <Credentials userDID={userDid} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
