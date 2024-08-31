// TransactionContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TransactionContextProps {
  transactions: any[];  // The type of your array (adjust as necessary)
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};
