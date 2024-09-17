import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../utils/AppContext';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header.tsx';
import Sidebar from '../components/Sidebar.tsx';
import Credentials from '../components/Credentials.tsx';
import welcome from '../images/user/welcome.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
const Profile = () => {

  const { userDid, userId } = useContext(AppContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [userDid, setUserDid] = useState<any>("");
  const [isCopied, setIsCopied] = useState(false);

  // useEffect(() => {
  //   const validateUser = async () => {
  //   if (!userId) {
  //     navigate('/');
  //   }
  // };
  // validateUser();
  // }, [navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(userDid);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
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
            
            <div className="flex h-22">
              <img src={welcome} alt="Welcome" />
            </div>
          </div>
            <h2 className='text-center text-2xl text-white font-bold mb-5 mt-5'>Your Credentials</h2>
            <div className="">
              <Credentials userDID={userDid}/>
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



