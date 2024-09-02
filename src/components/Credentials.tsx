import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios'
import { Jwt, VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { currencyIcons } from '../utils/helpers';
import Badge from '../images/badge.png';

interface credentialDetails {
  title: string;
  name: string;
  countryCode: string;
  issuanceDate: string;
}


const Credentials = ({userDID}: any) => {
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [credentialDetails, setCredentialDetails] = useState<credentialDetails>([]);
  const [formData, setFormData] = useState<{ name: string; countryCode: string }>({
    name: '',
    countryCode: '',
  });
  const [loading, setLoading] = useState(false);

  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 

  const togglePopup = (userId: string) => {
    credentialDetails.map((user) => { 
      if (user.recordId === userId) {
        setFormData({
          name: user.name,
          countryCode: user.countryCode,
        });
      }
    });
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [userId]: !prevMap[userId],
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
       if (name === 'name' || name === 'countryCode') {
        const letterRegex = /^[A-Za-z\s]+$/;
        if (!value.match(letterRegex) && value !== '') {
          return;
        }
      }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };

  const handleGetCredential = () => {
    axios.get('https://mock-idv.tbddev.org/kcc', {
        params: {
          name: formData.name,
          country: formData.countryCode,
          did: userDID,
        },
        })
        .then((response) => {
            localStorage.setItem('credentialJWT', response.data)
            setFormData({
              name: '',
              countryCode: '',
            })
            setPopupOpen(false);
            fetchCredential();
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
  }

  const credentialJWT = localStorage.getItem('credentialJWT') || '';

  useEffect(() => {
    if (!credentialJWT) {
      return;
    }
    fetchCredential();
  }, []);

  const fetchCredential = () => {
    const vc: any = Jwt.parse({ jwt: credentialJWT }).decoded.payload['vc']
    setCredentialDetails({
    title: vc.type[vc.type.length - 1].replace(/(?<!^)(?<![A-Z])[A-Z](?=[a-z])/g, ' $&'),
    name: vc.credentialSubject['name'],
    countryCode: vc.credentialSubject['countryOfResidence'],
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  })
}

  return (
    <>
      {Object.keys(credentialDetails).length > 0 ? (
    <main>
    <div className="grid text-black lg:grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      <div className="flex justify-between overflow-hidden p-2 rounded-lg border border-stroke bg-white shadow-md shadow-meta-5 dark:border-strokedark dark:bg-boxdark">
          <div>
            <p className='text-lg font-bold'>{credentialDetails.title}</p>
            <p><span className='font-medium'>Owner:</span> {credentialDetails.name}</p>
            <p><span className='font-medium'>Country:</span> {credentialDetails.countryCode}</p>
            <p><span className='font-medium'>Date Issued:</span> {credentialDetails.issuanceDate}</p>
          </div>
          <div className="flex-shrink-0 ">
            <img
              src={Badge}
              alt="verified badge"
              className="h-20 w-20 rounded-full" 
            />
          </div>
        </div>
    </div>
    </main>
    ) : (
      <div className="flex items-center flex-col py-20">
        <div className="text-md font-medium text-white">
          No Credential yet
        </div>
        <div>
          <button
            ref={trigger}
            onClick={() => setPopupOpen(!popupOpen)}
            className="inline-flex mt-5 items-center justify-center rounded-full bg-secondary py-3 px-10 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10">
            Get Verified
          </button>
        </div>      
        {popupOpen && (
              <div
                ref={popup}
                className="fixed inset-0 flex items-center text-white justify-center z-50 bg-primary bg-opacity-70"
              >
                <div
                  className="bg-tertiary lg:w-1/2 rounded-lg pt-2 px-6 shadow-md"
                  style={{ maxHeight: 'calc(100vh - 180px)' }}
                >
                  <div className="flex flex-row justify-between">
                    <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">Verify your Details</h2>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setPopupOpen(false)} 
                        className="text-blue-500 hover:text-gray-700 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 fill-current bg-white rounded-full p-1 hover:bg-opacity-90"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="black"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <form>
                    <div className="flex flex-col gap-5.5">
                        <div>
                            <label className="mb-2.5 block text-white">Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-tertiary py-3 px-5 font-medium outline-none"
                            >
                            </input>
                        </div>

                        <div>
                            <label className="mb-2.5 block text-white">Country Code</label>
                            <input
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleInputChange}
                                required
                                className="w-full mb-5 rounded-lg border-[1.5px] border-stroke bg-tertiary py-3 px-5 font-medium outline-none"
                            >
                            </input>
                        </div>
                    </div> 
                  </form>
                    <button
                      type="button"
                      onClick={handleGetCredential}
                      disabled={loading}
                      className={`mr-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-secondary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="spinner"></div>
                          <span className="pl-1">Getting Credential...</span>
                        </div>
                      ) : (
                        <>Verify</>
                      )}
                    </button>
                </div>
              </div>
            )}
      </div>
    )}
    </>
  );
};

export default Credentials;





