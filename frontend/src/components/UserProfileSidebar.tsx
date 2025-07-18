// components/UserProfileSidebar.tsx
import { useEffect } from 'react';
import { CircleUser, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuth';
import { useTransactionStore } from '../store/useTransactionStore';
import { deleteUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileSidebar({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const transactions = useTransactionStore((state) => state.transactions);
  const totalTransactions = transactions.length ?? 0;
  const formattedDate = user?.createdAt
    ? (() => {
        const date = new Date(user.createdAt);
        const day = date.getDate();
        const month = date.toLocaleString('en-IN', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
      })()
    : '{ Something went wrong! }';

  const handleDeleteUser = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirm) return;

    try {
      await deleteUser(Number(user?.id));
      localStorage.clear(); // or zustand reset
      navigate('/'); // or dashboard page
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Something went wrong. Please try again.');
    }
  }

  // Disable scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="ml-auto w-100 h-screen bg-lightDark p-6 animate-slide-in-right relative z-10 flex flex-col"
      >
        <button
          className="absolute top-3 right-3 text-xl font-bold cursor-pointer bg-rose-800 rounded-sm p-1 hover:bg-rose-700"
          onClick={onClose}
        >
          <X size={28} />
        </button>
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pr-1">
          <CircleUser className="mx-auto text-neutral-600" size={140} />
          <p className="text-center text-4xl font-semibold text-neutral-200 mt-2">{user?.name}</p>
          <p className="text-center text-md text-neutral-200 mt-2">Member since {formattedDate}</p>

          <p className="text-xl font-semibold text-neutral-200 mt-20">Email</p>
          <p className="text-lg py-1 px-2 w-auto border border-neutral-500 rounded-md bg-lighterDark text-neutral-200 mt-2">
            {user?.email}
          </p>

          <p className="text-xl font-semibold text-neutral-200 mt-8">Total Transactions</p>
          <p className="text-lg py-1 px-2 w-auto border border-neutral-500 rounded-md bg-lighterDark text-neutral-200 mt-2">
            {totalTransactions}
          </p>
        </div>

        {/* Fixed Footer Button */}
        <div className="pt-4">
          <button onClick={handleDeleteUser} className="w-full h-12 flex justify-center items-center gap-2 border border-rose-800 text-rose-700 text-lg font-medium rounded-md px-6 hover:bg-rose-800 hover:text-neutral transition duration-200">
            <Trash2 />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
