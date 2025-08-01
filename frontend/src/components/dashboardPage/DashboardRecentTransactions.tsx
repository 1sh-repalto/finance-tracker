import { Link } from 'react-router-dom';
import { Transaction } from '../../types';
import { useTransactionStore } from '../../store/useTransactionStore';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import SeeTransactionModal from '../SeeTransactionModal';
import TransactionListItem from '../transactionsPage/TransactionListItem';
import { getCategoryById } from '../../utils/getCategoryById';
import Twemoji from 'react-twemoji';

const DashboardRecentTransactions = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const loading = useTransactionStore((state) => state.loading);

  const recent3transactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  return (
    <div className="h-auto w-full rounded-lg bg-lightDark mt-12 p-5">
      <div className="flex gap-3 items-center">
        <h1 className="text-3xl text-neutral-500 font-semibold ml-2">Recent Transactions</h1>
        <Twemoji options={{ className: '' }}>
          <span className="w-10 h-10 inline-block">🧾</span>
        </Twemoji>
      </div>
      {transactions.length === 0 ? (
        <p className="text-xl font-semibold text-center py-5 text-neutral-600">
          No data available. Add transactions.
        </p>
      ) : (
        <ul className="mt-4 space-y-3 px-2">
          {loading ? (
            <div className="flex justify-center items-center mt-40">
              <Loader2 className="animate-spin text-neutral-400" size={50} />
            </div>
          ) : recent3transactions.length === 0 ? (
            <p className="text-neutral-400 italic text-center font-semibold text-3xl mt-40">
              No recent transactions
            </p>
          ) : (
            recent3transactions.map((txn) => {
              const category = getCategoryById(txn.categoryId);

              return (
                <TransactionListItem
                  key={txn.id}
                  transaction={txn}
                  category={category}
                  onClick={() => openModal(txn)}
                  onDelete={() => deleteTransaction(txn.id)}
                />
              );
            })
          )}
          <SeeTransactionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            transaction={selectedTransaction}
          />
        </ul>
      )}
      {!loading && recent3transactions.length !== 0 && (
        <div className="flex justify-center">
          <Link to={'/transactions'}>
            <button className="bg-lighterDark hover:bg-neutral-700 active:bg-lighterDark h-auto mt-3 py-2 px-15 rounded-md font-semibold text-lg cursor-pointer flex items-center gap-2 transition-transform duration-200 transform hover:scale-105">
              See all
              <ArrowRight size={22} />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardRecentTransactions;
