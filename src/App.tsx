import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TbdexHttpClient } from '@tbdex/http-client';
import { PFIs } from './utils/helpers';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Convert from './pages/Payments/Convert';
import Pfi from './pages/Payments/Pfi';
import Transactions from './pages/Transactions';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Loader from './common/Loader';
import routes from './routes';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
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
      } catch (error) {
        console.error('Failed to prefetch offerings:', error);
      }
    };
    if (!localStorage.getItem('offeringsData')) {
      prefetchOfferings();
    }
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
    <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto'/>
  
      <Routes>
        <Route path="/" index element={<SignIn />} />
        <Route path="/signin" index element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signin/forgot-password" element={<ForgotPassword />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payments/convert" element={<Convert />} />
        <Route path="/payments/pfi/:did" element={<Pfi />} />
        <Route element={<DefaultLayout />}>
          <Route element={<Dashboard />} />
          {routes.map(({ path, component: Component }) => (
            <Route
              path={path}
              element={
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;




