import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TransactionProvider } from './components/TransactionContext';
import App from './App';
import './index.css';
import './satoshi.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
    <ToastContainer />
    <TransactionProvider>
      <App />
    </TransactionProvider>
    </Router>
  </React.StrictMode>
);
