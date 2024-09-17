import { createContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { PFIs } from './helpers';
import { TbdexHttpClient } from '@tbdex/http-client';
import { DidDht } from '@web5/dids'


import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export const AppContext = createContext();

const ContextProvider = ({ children }) => {

    const [userDid, setUserDid] = useState("");

    const { signIn, signOut } = useAuthActions();

    const user = useQuery(api.myFunctions.currentUser);
    const userId = user?._id;
    // const username = user?.username;
    const emailAddress = user?.email;
    const email = emailAddress?.split('@')[0];

    const createOfferings = useMutation(api.offerings.createOfferings);
    // const offerings = useQuery(api.offerings.getOfferings);
    const createTransaction = useMutation(api.transactions.createTransaction);
    const Transactions = useQuery(api.transactions.getTransactions);
    // const userTransactions = useQuery(api.transactions.getUserTransactions, { userId: userId });
    // const pfiReviews = useQuery(api.reviews.getPfiReviews, { userId: userId });
    const reviews = useQuery(api.reviews.getReviews);
    const createReview = useMutation(api.reviews.createReview);
    const updateTransaction = useMutation(api.transactions.updateTransaction);
    const saveVcJWT = useMutation(api.vcs.createVcJWT);
    const getVcJWT = useQuery(api.vcs.getVcJWT, { userId: userId });   

    useEffect(() => {
        prefetchOfferings();
    }, []);

    const prefetchOfferings = async () => {
    try {
    const offeringsData: { [key: string]: any[] } = {};
    for (const pfi of PFIs) {
        const offerings = await TbdexHttpClient.getOfferings({
        pfiDid: pfi.did
        });
        offeringsData[pfi.did] = offerings;
    }
    localStorage.setItem('offerings', JSON.stringify(offeringsData));
    // createOfferings({ offerings: offeringsData });
    // console.log(offeringsData);
    } catch (error) {
    console.error('Failed to prefetch offerings:', error);
    }
  };

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

        



  const value = {
    userDid,
    userId,
    email,
    createOfferings,
    createTransaction,
    Transactions,
    // userTransactions,
    // pfiReviews,
    reviews,
    createReview,
    updateTransaction,
    initializeDid,
    prefetchOfferings,
    signIn,
    signOut,
  };

  return (
    <div>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </div>
  );
};

export default ContextProvider;


