import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Home, Users, Calendar, MessageCircle } from 'lucide-react';

const Dashboard = () => {
   const { user } = useAuth();

   const container = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1
         }
      }
   };

   const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
   };

   return (
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
         {/* --- GRAND HERO SECTION --- */}
         <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[350px] rounded-3xl overflow-hidden shadow-2xl group"
         >
            {/* Background Image - Use a high-quality stock photo of a global city */}
            <img
               src="https://www.makehappen.org/wp-content/uploads/2020/04/600-campus-75731374.jpg?auto=format&fit=crop&q=80&w=2070"
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               alt="University Campus"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex flex-col justify-center px-12 text-white">
               <h1 className="text-5xl font-bold mb-4">
                  Hello, <span className="text-primary-400">{user?.name || 'Explorer'}!</span> 👋
               </h1>
               <p className="text-slate-200 text-xl max-w-md leading-relaxed">
                  Welcome to your Erasmus journey{user?.city ? ' in ' + user?.city : ''}. Connect, explore, and find your home away from home.
               </p>
            </div>
         </motion.section>

         {/* --- BENTO GRID LAYOUT --- */}
         <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto"
         >
            {/* LARGE CARD: Housing (Featured) */}
            <Link to="/housing" className="md:col-span-2 md:row-span-2">
               <motion.div variants={item} className="h-full bento-item glass-card rounded-3xl overflow-hidden cursor-pointer group">
                  <div className="h-2/3 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Housing" />
                  </div>
                  <div className="p-6">
                     <div className="flex items-center gap-2 mb-2">
                        <Home size={20} className="text-primary-500" />
                        <h3 className="text-2xl font-bold">Find Housing</h3>
                     </div>
                     <p className="text-slate-500">Discover vetted student apartments{user?.city ? ' in ' + user?.city : ' near you.'}</p>
                  </div>
               </motion.div>
            </Link>

            {/* MEDIUM CARD: Roommates */}
            <Link to="/roommates" className="md:col-span-2">
               <motion.div variants={item} className="h-full bento-item bg-gradient-to-br from-secondary-500 to-primary-600 rounded-3xl p-8 text-white flex justify-between items-center cursor-pointer group">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <Users size={24} />
                        <h3 className="text-2xl font-bold">Find Roommates</h3>
                     </div>
                     <p className="text-white/80">Match with students who share your interests.</p>
                  </div>
                  <div className="text-5xl opacity-40 group-hover:opacity-100 transition-opacity">🤝</div>
               </motion.div>
            </Link>

            {/* SMALL CARD: Messages */}
            <Link to="/chat">
               <motion.div variants={item} className="h-full bento-item glass-card rounded-3xl p-6 cursor-pointer hover:bg-white group">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                     <MessageCircle size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Messages</h3>
                  <p className="text-sm text-slate-500">Connect with your matches.</p>
               </motion.div>
            </Link>

            {/* SMALL CARD: Events */}
            <Link to="/profile">
               <motion.div variants={item} className="h-full bento-item glass-card rounded-3xl p-6 cursor-pointer hover:bg-white group">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                     <Calendar size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Events</h3>
                  <p className="text-sm text-slate-500">Coming Soon</p>
               </motion.div>
            </Link>

         </motion.div>
      </div>
   );
};

export default Dashboard;
