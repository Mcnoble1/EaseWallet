import { lazy } from 'react';

const Transactions = lazy(() => import('../pages/Transactions'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const Convert = lazy(() => import('../pages/Payments/Convert'));
const Pfi = lazy(() => import('../pages/Payments/Pfi'));
const Profile = lazy(() => import('../pages/Profile'));

const coreRoutes = [
  {
    path: '/forgot-password',
    title: 'Forgot Password',
    component: ForgotPassword,
  },
  {
    path: '/dashboard', 
    title: 'Dashboard',
    component: Dashboard, 
  },
  {
    path: '/transactions',
    title: 'Transactions',
    component: Transactions,
  },
  {
    path: '/payments/convert',
    title: 'Convert',
    component: Convert,
  },
  {
    path: '/payments/pfi/:did',
    title: 'PFI',
    component: Pfi,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  }
];

const routes = [...coreRoutes];
export default routes;
