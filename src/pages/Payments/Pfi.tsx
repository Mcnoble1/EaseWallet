import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import { faDollarSign, faPiggyBank, faCreditCard, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Offerings from '../../components/Offerings';
import 'react-toastify/dist/ReactToastify.css'; 
import '../signin.css';

const PFIs = [
  {
    did: 'did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y',
    name: 'AquaFinance Capital',
    description: 'Provides exchanges with the Ghanaian Cedis: GHS to USDC, GHS to KES',
    icon: faDollarSign,
    backgroundColor: '#1e3a8a'
  },
  {
    did: 'did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy',
    name: 'Flowback Financial',
    description: 'Offers international rates with various currencies - USD to GBP, GBP to CAD.',
    icon: faPiggyBank,
    backgroundColor: '#065f46'
  },
  {
    did: 'did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y',
    name: 'Vertex Liquid Assets',
    description: 'Offers exchange rates with the South African Rand: ZAR to BTC and EUR to ZAR.',
    icon: faCreditCard,
    backgroundColor: '#b91c1c'
  },
  {
    did: 'did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o',
    name: 'Titanium Trust',
    description: 'Offers exchange rates with the South African Rand: ZAR to BTC and EUR to ZAR.',
    icon: faChartLine,
    backgroundColor: '#4a5568'
  }
];

const Pfi = () => {
    const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

const { did } = useParams();
const pfi = PFIs.find((pfi) => pfi.did === did);

  return (
    <div className="bg-primary">
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className='text-white text-center'>
              <h1 className='text-3xl font-bold mb-5'>{pfi.name}</h1>
              <p className='text-xl mb-10'>{pfi.description}</p>
            </div>

            <div className="flex flex-col gap-10">
              <Offerings pfiDid={did} />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <span className="text-lg">John Doe</span>
                  <div className="flex ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nunc auctor, tincidunt nunc id, aliquam nunc. Sed id nunc auctor, tincidunt nunc id, aliquam nunc.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <span className="text-lg">Jane Smith</span>
                  <div className="flex ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 1a1 1 0 0 1 .95.684l1.9 5.8h6.45a1 1 0 0 1 .934 1.357l-4.92 14.2a1 1 0 0 1-1.868 0l-4.92-14.2A1 1 0 0 1 1.65 7.484h6.45l1.9-5.8A1 1 0 0 1 10 1zm0 2.38L8.8 6.57H3.65l4.92 14.2L16.5 6.57H11.3L10 3.38zm1 9.24a1 1 0 0 1 .3.707l-.6 1.84h1.94l-.6-1.84a1 1 0 0 1 .3-.707z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nunc auctor, tincidunt nunc id, aliquam nunc. Sed id nunc auctor, tincidunt nunc id, aliquam nunc.</p>
              </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  </div>
  );
};

export default Pfi;     