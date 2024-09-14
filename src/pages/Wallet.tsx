import { useState, useEffect } from 'react';
import Header from '../components/Header.tsx';
import Sidebar from '../components/Sidebar.tsx';
import Breadcrumb from '../components/Breadcrumb';
import AddBankAccount from '../components/BankAccount.tsx';
import AddCard from '../components/DebitCard.tsx';
import Balance from '../components/Balance.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Wallet = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    // Fetch cards and bank details from backend
    const fetchPaymentMethods = async () => {
      const cardResponse = await fetch(`/api/wallet/${user?.id}/cards`);
      const cardData = await cardResponse.json();
      setCards(cardData);

      const bankResponse = await fetch(`/api/wallet/${user?.id}/bankAccounts`);
      const bankData = await bankResponse.json();
      setBankAccounts(bankData);
    };
    fetchPaymentMethods();
  }, [user?.id]);

  return (
    <div className="bg-primary">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="Wallet" />
              </div>

              {/* Balance Display */}
              <Balance user={user} />

              {/* Add Card & Bank Details Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  className="bg-secondary text-white py-2 px-4 rounded-lg"
                  onClick={() => setShowAddCardModal(true)}
                >
                  Add Card
                </button>
                <button
                  className="bg-secondary text-white py-2 px-4 rounded-lg"
                  onClick={() => setShowAddBankModal(true)}
                >
                  Add Bank Details
                </button>
              </div>

              {/* Display Added Cards */}
              {cards.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">Your Cards</h3>
                  <div className="space-y-4">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="p-4 border rounded-lg flex justify-between"
                      >
                        <span>**** **** **** {card.last4}</span>
                        <span>
                          {card.expiryMonth}/{card.expiryYear}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Added Bank Accounts */}
              {bankAccounts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">Your Bank Accounts</h3>
                  <div className="space-y-4">
                    {bankAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="p-4 border rounded-lg flex justify-between"
                      >
                        <span>{account.accountNumber}</span>
                        <span>{account.bankName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Card Modal */}
              {showAddCardModal && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-gray-900 bg-opacity-50">
                  <div className="bg-gray p-6 rounded-lg relative">
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="absolute top-2 right-2 text-xl cursor-pointer"
                      onClick={() => setShowAddCardModal(false)}
                    />
                    <AddCard userId={user?.id} />
                  </div>
                </div>
              )}

              {/* Add Bank Modal */}
              {showAddBankModal && (
                <div className="fixed inset-0 flex z-999 items-center justify-center bg-gray-900 bg-opacity-50">
                  <div className="bg-gray p-6 rounded-lg relative">
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="absolute top-2 right-2 text-xl cursor-pointer"
                      onClick={() => setShowAddBankModal(false)}
                    />
                    <AddBankAccount userId={user?.id} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
