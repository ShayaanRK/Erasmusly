import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const { login } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await login(email, password);
         navigate('/');
      } catch (err) {
         setError(err.response?.data?.message || 'Login failed');
      }
   };

   return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
         >
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">Erasmusly</h1>
               <p className="text-slate-500">Welcome back! Please login to continue.</p>
            </div>

            {error && (
               <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                  {error}
               </div>
            )}

            <button
               type="button"
               onClick={() => {
                  setEmail('sophia@example.com');
                  setPassword('123456');
               }}
               className="w-full mb-6 py-2 px-4 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
               <span>✨</span> Auto-fill Demo Account
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="input-field"
                     placeholder="student@example.com"
                     required
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="input-field"
                     placeholder="••••••••"
                     required
                  />
               </div>
               <button type="submit" className="w-full btn-primary py-3">
                  Login
               </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
               Don't have an account?{' '}
               <Link to="/register" className="text-primary-600 font-medium hover:underline">
                  Sign up
               </Link>
            </p>
         </motion.div>
      </div>
   );
};

export default Login;
