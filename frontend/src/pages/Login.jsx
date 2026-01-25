import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="min-h-screen grid lg:grid-cols-2 bg-white">
         {/* LEFT SIDE: Visual/Grand Branding */}
         <div className="hidden lg:flex relative bg-slate-900 items-center justify-center overflow-hidden">
            <img
               src="https://st5.depositphotos.com/4218696/76489/i/450/depositphotos_764892050-stock-photo-student-exchange-programs-happy-multiracial.jpg?auto=format&fit=crop&q=190&w=460"
               className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
               alt="Students"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            <div className="relative z-10 text-left p-16 max-w-2xl">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Join 5,000+ Erasmus students</span>
               </div>
               <h2 className="text-6xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                  Experience Erasmus <span className="text-primary">with a new style.</span>
               </h2>
               <p className="text-slate-300 text-2xl leading-relaxed mb-10 opacity-90">
                  Connect with Erasmus students worldwide, find your dream home, and unlock local experiences.
               </p>
               <div className="flex items-center gap-4 text-white/70 text-sm font-medium">
                  <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/5 py-2 px-4 rounded-xl border border-white/10">
                     <ShieldCheck className="h-4 w-4 text-primary" />
                     <span>Verified Housing</span>
                  </div>
                  <div className="flex items-center gap-1.5 backdrop-blur-sm bg-white/5 py-2 px-4 rounded-xl border border-white/10">
                     <Globe className="h-4 w-4 text-primary" />
                     <span>Global Community</span>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT SIDE: Login Form */}
         <div className="flex items-center justify-center p-8 lg:p-16">
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="w-full max-w-md space-y-10"
            >
               <div className="lg:hidden flex items-center gap-2 mb-12">
                  <div className="bg-primary rounded-lg p-1.5 shadow-lg shadow-primary/20">
                     <Globe className="text-white h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-slate-900">Erasmusly</span>
               </div>

               <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome back</h1>
                  <p className="text-slate-500 text-lg">Enter your credentials to access your student portal.</p>
               </div>

               {error && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="bg-destructive/10 text-destructive p-4 rounded-2xl text-sm font-medium border border-destructive/20"
                  >
                     {error}
                  </motion.div>
               )}

               <Button
                  type="button"
                  onClick={() => {
                     setEmail('sophia@example.com');
                     setPassword('123456');
                  }}
                  variant="outline"
                  className="w-full py-6 bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold"
               >
                  <Sparkles className="h-5 w-5 text-primary" /> Auto-fill Demo Account
               </Button>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest leading-none">Or continue with</span></div>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 tracking-tight ml-1 uppercase opacity-60">Email Address</label>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                        placeholder="sophia@example.com"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold text-slate-700 tracking-tight uppercase opacity-60">Password</label>
                        <Link to="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                     </div>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                        placeholder="••••••••"
                        required
                     />
                  </div>

                  <Button type="submit" className="w-full py-7 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 group">
                     Login to Dashboard <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </form>

               <p className="pt-2 text-center text-slate-500 font-medium">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary font-bold hover:underline">
                     Start your journey
                  </Link>
               </p>
            </motion.div>
         </div>

         <style>{`
            @keyframes slow-zoom {
               0% { transform: scale(1.05); }
               50% { transform: scale(1.15); }
               100% { transform: scale(1.05); }
            }
            .animate-slow-zoom {
               animation: slow-zoom 30s ease-in-out infinite;
            }
         `}</style>
      </div>
   );
};

export default Login;
