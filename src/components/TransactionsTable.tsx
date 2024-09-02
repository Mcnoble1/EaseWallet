import React, { useState, useRef, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'; 
import { getFeedbacks, deleteFeedback } from '../api/feedbackApi';
import { formatDatetime } from '../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCaretDown, faCaretUp, faFileAlt, faCoins, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Close } from '@tbdex/http-client'
import { useTransactionContext } from './TransactionContext';


interface Transaction {
  _id: number;
  date: string;
  description: string;
  amount: string;
  status: string;
}

const TransactionsTable: React.FC = ({ onClick }) => {
  // const { transactions } = useTransactionContext();
  const transactions = localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions') || '') : [];
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(true);
  const [showTransferDetails, setShowTransferDetails] = useState(true);
  const [showTransactionTimeline, setShowTransactionTimeline] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const popup = useRef<HTMLDivElement | null>(null);
  
  const toggleSidebar = (transactionId: string) => {
    const selectedTransaction = transactions.find(transaction => transaction.id === transactionId);
    // console.log('Selected Transaction:', selectedTransaction);
    setSelectedTransaction([selectedTransaction]);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const formatTime = (datestring) => {
    const date = new Date(datestring);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  const generateExchangeStatusValues = (exchangeMessage) => {
    if (exchangeMessage instanceof Close) {
      if (exchangeMessage.data.reason?.toLowerCase().includes('complete') || exchangeMessage.data.reason?.toLowerCase().includes('success') ) {
        return 'completed'
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('expired')) {
        return exchangeMessage.data.reason.toLowerCase()
      } else if (exchangeMessage.data.reason?.toLowerCase().includes('cancelled')) {
        return 'cancelled'
      } else {
        return 'failed'
      }
    }
    // console.log('Exchange Message:', exchangeMessage);
    // console.log('Exchange Message Kind:', exchangeMessage.kind);
    return exchangeMessage.kind
  }

  const renderOrderStatus = (exchange) => {
    const status = generateExchangeStatusValues(exchange)
    switch (status) {
      case 'rfq':
        return 'Requested'
      case 'quote':
        return 'Quoted'
      case 'order':
      case 'orderstatus':
        return 'Pending'
      case 'completed':
        return 'Completed'
      case 'expired':
        return 'Expired'
      case 'cancelled':
        return 'Cancelled'
      case 'failed':
        return 'Failed'
      default:
        return status
    }
  }

  return (
    <>
      <div className="rounded-lg text-white border border-strokedark bg-tertiary px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="flex flex-row justify-between">
          <h4 className="text-title-sm mb-4 font-semibold text-white">
            Transactions
          </h4>
        </div>

       {transactions.length > 0 ? (
           <div className="flex flex-col overflow-x-auto">
           <table className="min-w-full">
             <thead>
               <tr className="border-b border-strokedark ">
                 {/* Header cells */}
                 <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Date</th>
                 <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Description</th>
                 <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Amount</th>
                 <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Status</th>
                 <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase"></th>
               </tr>
             </thead>
             <tbody>
               {/* Table body */}
               {transactions.map((transaction, index) => (
                 <tr key={transaction.id} onClick={() => toggleSidebar(transaction.id)} className={`border-b border-strokedark ${index === 0 ? 'rounded-t-sm' : ''}`}>
                   <td className="p-2.5 xl:p-5">{formatDatetime(transaction.createdTime)}</td>
                   <td className="p-2.5 xl:p-5">Outgoing Payment</td>
                   <td className="p-2.5 xl:p-5">{transaction.payinAmount} {transaction.payinCurrency}</td>
                   <td className="p-2.5 xl:p-5"><span className={`${(transaction.status) === "completed" ? 'bg-green' : 'bg-danger' } px-2 pb-1 rounded-2xl font-medium text-white`}>{transaction.status}</span></td>
                   <td className="p-2.5 xl:p-5">
                     <div className="flex flex-row gap-4">
                       <button
                         className="rounded py-2 px-3 text-white hover:bg-opacity-90"
                       >
                         <FontAwesomeIcon icon={faCaretRight} className='ease-in'/>
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       ) : (
         <div className="flex justify-center items-center h-40">
           <p className="text-white">No transactions found</p>
         </div>
       )
      }
      </div>

      {isSidebarOpen && (
  <div className="fixed right-0 top-0 h-screen borde w-full lg:w-[25%] z-9999 bg-primary text-white shadow-lg">
    {selectedTransaction && selectedTransaction.map((transaction, index) => (
      <div className="h-screen p-5 flex flex-col overflow-y-auto">
        <div className="flex justify-end">
          <FontAwesomeIcon 
            onClick={() => setIsSidebarOpen(false)} 
            icon={faXmark} 
            className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition duration-150" 
          />
        </div>
        
        {/* Summary Card */}
        <div className="bg-tertiary text-white p-4 rounded-lg shadow-md mb-4 flex flex-col items-center">
          <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-4xl mb-2" />
          <p className="text-lg font-semibold text-center">Withdrawal to {transaction.to}</p>
          <p className="text-2xl font-bold mt-2">{transaction.payinAmount} {transaction.payinCurrency}</p>
          <p className={`text-sm mt-2 px-2 py-1 rounded-lg font-medium ${transaction.status === "completed" ? 'bg-green' : 'bg-danger'}`}>
            {transaction.status}
          </p>
          <p className="text-gray-400 mt-1">{formatDatetime(transaction.createdTime)}</p>
        </div>

        {/* Transaction Details Dropdown */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer text-white"
            onClick={() => setShowTransactionDetails(!showTransactionDetails)}
          >
            <p className="text-lg font-semibold">Transaction details</p>
            <FontAwesomeIcon icon={showTransactionDetails ? faCaretUp : faCaretDown} className="text-gray-400" />
          </div>
          {showTransactionDetails && (
            <div className="mt-2 text-gray-300">
              <p>Exchange ID: {transaction.id}</p>
              <p>Sender: {transaction.from}</p>
              <p>Amount: {transaction.payinAmount} {transaction.payinCurrency}</p>
              <p>Recipient: {transaction.to}</p>
              <p>Fee: {transaction.fee}</p>
              <p>Recipient Amount: {transaction.payoutAmount} {transaction.payoutCurrency}</p>
            </div>
          )}
        </div>

        {/* Transfer Details Dropdown */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer text-white"
            onClick={() => setShowTransferDetails(!showTransferDetails)}
          >
            <p className="text-lg font-semibold">Transfer details</p>
            <FontAwesomeIcon icon={showTransferDetails ? faCaretUp : faCaretDown} className="text-gray-400" />
          </div>
          {showTransferDetails && (
            <div className="mt-2 text-gray-300">
              <p>Order ID: {transaction.id}</p>
              <p>Fee: {transaction.fee}</p>
              <p>Amount: {transaction.payinAmount} {transaction.payinCurrency}</p>
              <p>Recipient: {transaction.to}</p>
            </div>
          )}
        </div>

        {/* Transaction Timeline Dropdown */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer text-white"
            onClick={() => setShowTransactionTimeline(!showTransactionTimeline)}
          >
            <p className="text-lg font-semibold">Transaction timeline</p>
            <FontAwesomeIcon icon={showTransactionTimeline ? faCaretUp : faCaretDown} className="text-gray-400" />
          </div>
          {showTransactionTimeline && (
            <div className="mt-2">
              <div className="relative">
                {/* Vertical line for timeline */}
                <div className="absolute left-4 top-0 h-full border-l-2 border-gray-600"></div>
                {/* Timeline events */}
                <div className="relative pl-8">
                  <div className="mb-4 flex items-center">
                    <div className="h-4 w-4 bg-green rounded-full"></div>
                    <p className="ml-4 text-gray-300">Requested for Quote: {formatTime(transaction.rfqTime)}</p>
                  </div>
                  <div className="mb-4 flex items-center">
                    <div className="h-4 w-4 bg-green rounded-full"></div>
                    <p className="ml-4 text-gray-300">Quote Generated At: {formatTime(transaction.quoteTime)}</p>
                  </div>
                  <div className="mb-4 flex items-center">
                    <div className="h-4 w-4 bg-green rounded-full"></div>
                    <p className="ml-4 text-gray-300">Order Placed: {formatTime(transaction.orderTime)}</p>
                  </div>
                  <div className="mb-4 flex items-center">
                    <div className="h-4 w-4 bg-green rounded-full"></div>
                    <p className="ml-4 text-gray-300">Order Status: {transaction.status}</p>
                  </div>
                  <div className="mb-4 flex items-center">
                    <div className="h-4 w-4 bg-green rounded-full"></div>
                    <p className="ml-4 text-gray-300">Order Completed: {formatTime(transaction.closeTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-auto flex items-center justify-center transition duration-150">
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          GET CONFIRMATION
        </button>
      </div>
    ))}
  </div>
)}

    </>
  );
};

export default TransactionsTable;






