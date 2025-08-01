import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { loginUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser({ email, password });
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_6rem] px-4">
      <div className="w-full max-w-xl text-neutral">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold mb-10">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          <input
            required
            id="email"
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-800 rounded-md w-2/3 h-12 px-4 outline-none border border-transparent focus:border-neutral"
          />
          <input
            required
            id="password"
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-800 rounded-md w-2/3 h-12 px-4 outline-none border border-transparent focus:border-neutral"
          />

          <button
            type="submit"
            className="w-2/3 h-12 rounded-md border border-secondary text-secondary text-lg font-medium hover:bg-secondary hover:text-neutral hover:drop-shadow-[0px_0px_8px_rgba(39,174,96,0.8)] active:drop-shadow-none active:bg-[#208049] transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm sm:text-base select-none">
          Don&apos;t have an account?{' '}
          <a
            onClick={() => navigate("/signup", { replace: true })}
            className="text-accent cursor-pointer hover:underline hover:drop-shadow-[0px_0px_10px_rgba(88,144,203,0.8)] active:drop-shadow-none"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
