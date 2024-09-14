import { lazy } from 'react';

const Transactions = lazy(() => import('../pages/Transactions'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const SendMoney = lazy(() => import('../pages/Payments/SendMoney'));
const Pfi = lazy(() => import('../pages/Payments/Pfi'));
const Profile = lazy(() => import('../pages/Profile'));
const Wallet = lazy(() => import('../pages/Wallet'));

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
    path: '/payments/send',
    title: 'SendMoney',
    component: SendMoney,
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
  },
  {
    path: '/wallet',
    title: 'Wallet',
    component: Wallet,
  },
];

const routes = [...coreRoutes];
export default routes;
