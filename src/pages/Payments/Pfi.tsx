import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { faDollarSign, faPiggyBank, faCreditCard, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Offerings from '../../components/Offerings';
import ReviewsList from '../../components/ReviewsList';
import 'react-toastify/dist/ReactToastify.css'; 
import '../signin.css';

interface Review {
  rating: number;
  review: string;
  name: string;
  pfi: string;
  transaction: string;
}

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
  const [reviews, setReviews] = useState<Review[]>([]); // Ensure this is an array
  const { did } = useParams();
  const pfi = PFIs.find((pfi) => pfi.did === did);

  useEffect(() => {
    // Get all reviews from localStorage
    const allReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    // Filter reviews where the pfi matches the did from the URL params
    const pfiReviews = allReviews.filter((review: Review) => review.pfi === did);
    // Update the state with the filtered reviews
    setReviews(pfiReviews);
  }, [did]); // Re-run the effect when `did` changes

  return (
    <div className="bg-primary">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className='text-white text-center'>
                <h1 className='text-3xl font-bold mb-5'>{pfi?.name}</h1>
                <p className='text-xl mb-10'>{pfi?.description}</p>
              </div>

              <div className="flex flex-col gap-10">
                <Offerings pfiDid={did} />
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl text-white font-bold mb-2 mt-5">Customer Reviews</h2>
                <div className="container mx-auto p-1">
                  <ReviewsList reviews={reviews} />
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
