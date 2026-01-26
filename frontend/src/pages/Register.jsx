import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      university: '',
      city: '',
      country: '',
      budgetRange: '',
      interests: '', // comma separated local state
   });
   const [loading, setLoading] = useState(false);
   const { register } = useAuth();
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.city.trim()) {
         return;
      }

      setLoading(true);
      try {
         const dataToSubmit = {
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim(),
            city: formData.city.trim(),
            interests: formData.interests ? formData.interests.split(',').map(i => i.trim()).filter(Boolean) : [],
         };
         await register(dataToSubmit);
         navigate('/');
      } catch (err) {
         // Error is handled by AuthContext with toast
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-10">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl"
         >
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">Join Erasmusly</h1>
               <p className="text-slate-500">Connect with fellow exchange students.</p>
            </div>



            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input name="name" onChange={handleChange} className="input-field" placeholder="John Doe" required />
               </div>
               <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input name="email" type="email" onChange={handleChange} className="input-field" placeholder="student@example.com" required />
               </div>

               <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input name="password" type="password" onChange={handleChange} className="input-field" placeholder="••••••••" required />
               </div>

               <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target City</label>
                  <input name="city" onChange={handleChange} className="input-field" placeholder="Barcelona" required />
               </div>
               <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
                  <input name="university" onChange={handleChange} className="input-field" placeholder="UB" />
               </div>

               <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Budget Range</label>
                  <input name="budgetRange" onChange={handleChange} className="input-field" placeholder="e.g. 500-800" />
               </div>
               <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input name="country" onChange={handleChange} className="input-field" placeholder="Spain" />
               </div>

               <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Interests (comma separated)</label>
                  <input name="interests" onChange={handleChange} className="input-field" placeholder="Hiking, Parties, Museums" />
               </div>

               <div className="col-span-2 mt-4">
                  <button
                     type="submit"
                     disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.city.trim()}
                     className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                     {loading ? (
                        <>
                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                           Creating Account...
                        </>
                     ) : (
                        'Create Account'
                     )}
                  </button>
               </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
               Already have an account?{' '}
               <Link to="/login" className="text-primary-600 font-medium hover:underline">
                  Login
               </Link>
            </p>
         </motion.div>
      </div>
   );
};

export default Register;
