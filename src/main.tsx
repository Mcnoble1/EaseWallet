import React from 'react';
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import ContextProvider from "./utils/AppContext.tsx";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import './satoshi.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <ContextProvider>
      <Router>
        <ToastContainer />
            <App />
        </Router>
      </ContextProvider>
    </ConvexAuthProvider>
  </React.StrictMode>
);
