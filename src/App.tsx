import { Suspense, lazy, useEffect, useState, useContext } from 'react';
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { AppContext } from "./utils/AppContext";
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SendMoney from './pages/Payments/SendMoney';
import Pfi from './pages/Payments/Pfi';
import Transactions from './pages/Transactions';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Wallet from './pages/Wallet';
import Loader from './common/Loader';
import routes from './routes';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {

  const { userId, offerings, prefetchOfferings } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    prefetchOfferings;
    if (!offerings) {
      prefetchOfferings;
    }
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
    <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto'/>
      <AuthLoading><Loader /></AuthLoading>
        <Routes>
          <Route path="/" element={<SignIn />} />
        </Routes>
        <Unauthenticated>
          <Routes>
            {/* <Route path="/" element={<SignIn />} /> */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signin/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Unauthenticated>
        <Authenticated>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<Wallet user={userId} />} />
            <Route path="/payments/send" element={<SendMoney />} />
            <Route path="/payments/pfi/:did" element={<Pfi />} />
            <Route element={<DefaultLayout />}>
              <Route element={<Dashboard />} />
              {routes.map(({ path, component: Component }) => (
                <Route
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component user={userId} />
                    </Suspense>
                  }
                />
              ))}
            </Route>
          </Routes>
        </Authenticated>
    </>
  );
}

export default App;




