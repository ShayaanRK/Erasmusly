import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Home, Users, Calendar, MessageSquare, ArrowRight, MapPin, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
   };

   return (
      <div className="w-full mt-0 pb-20 space-y-16 overflow-x-hidden">
         {/* --- GRAND HERO SECTION --- */}
         <section className="relative w-full h-[550px] md:h-[650px] flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
               <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070"
                  className="w-full h-full object-cover scale-105 animate-slow-zoom"
                  alt="University Campus"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-background" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
               >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
                     <Sparkles className="h-4 w-4 text-primary" />
                     <span>Certified Erasmus Student Portal</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                     Hello, <span className="text-primary">{user?.name || 'Explorer'}</span>. <br />
                     Find your <span className="text-gradient">Community.</span>
                  </h1>
                  <p className="text-slate-200 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12 opacity-90 font-medium">
                     Seamlessly connect with fellow students{user?.city ? ` in ${user.city}` : ''},
                     secure verified housing, and discover local adventures.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                     <Button size="lg" className="h-16 px-10 text-xl font-black rounded-2xl shadow-2xl shadow-primary/40 group">
                        Find Roommates <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                     <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-black rounded-2xl bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all">
                        Events List
                     </Button>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* --- DASHBOARD CONTENT --- */}
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-1 w-12 bg-primary rounded-full" />
                     <span className="text-primary font-bold uppercase tracking-widest text-xs">Official Dashboard</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">Your Student Portal</h2>
                  <p className="text-slate-500 text-lg font-medium">Manage your housing, matches, and messages in one place.</p>
               </div>

               <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-4 py-2 rounded-2xl border border-green-100 font-bold text-sm shadow-sm group hover:scale-105 transition-transform cursor-default">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Profile Verified</span>
               </div>
            </div>

            {/* --- BENTO GRID LAYOUT --- */}
            <motion.div
               variants={container}
               initial="hidden"
               animate="show"
               className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-8"
            >
               {/* LARGE CARD: Housing (Featured) */}
               <Link to="/housing" className="md:col-span-8 md:row-span-2 group">
                  <motion.div variants={item} className="h-full">
                     <Card className="h-full overflow-hidden border-none shadow-2xl bento-item group-hover:shadow-primary/20 transition-all duration-500 rounded-[2.5rem]">
                        <div className="relative h-2/3 md:h-[60%] overflow-hidden">
                           <img
                              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                              alt="Housing"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                           <div className="absolute top-6 left-6">
                              <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 shadow-lg border border-white/20">
                                 <TrendingUp className="h-3.5 w-3.5" />
                                 <span>High Demand in {user?.city || 'Europe'}</span>
                              </div>
                           </div>
                        </div>
                        <div className="p-8 space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="p-3 bg-primary/10 rounded-2xl">
                                 <Home className="text-primary h-8 w-8" />
                              </div>
                              <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter">Verified Housing</CardTitle>
                           </div>
                           <CardDescription className="text-lg font-medium text-slate-500 max-w-xl">
                              Discover premium student apartments in {user?.city || 'your destination'} curated for the international community.
                           </CardDescription>
                           <div className="pt-4">
                              <span className="text-primary font-black text-lg inline-flex items-center group-hover:gap-4 transition-all gap-2">
                                 Browse 150+ Listings <ArrowRight className="h-5 w-5" />
                              </span>
                           </div>
                        </div>
                     </Card>
                  </motion.div>
               </Link>

               {/* MEDIUM CARD: Roommates */}
               <Link to="/roommates" className="md:col-span-4 group">
                  <motion.div variants={item} className="h-full">
                     <Card className="h-full border-none shadow-2xl bg-gradient-to-br from-primary to-secondary text-white bento-item overflow-hidden relative group-hover:shadow-secondary/30 rounded-[2.5rem]">
                        <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:opacity-30 transition-all duration-700">
                           <Users size={240} />
                        </div>
                        <div className="p-8 h-full flex flex-col justify-between relative z-10">
                           <div className="space-y-4">
                              <div className="p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-md border border-white/10">
                                 <Users className="h-8 w-8" />
                              </div>
                              <CardTitle className="text-3xl font-black tracking-tighter">Perfect Roommates</CardTitle>
                              <CardDescription className="text-white/80 text-lg font-medium">
                                 Our matching engine pairs you by interests and lifestyle.
                              </CardDescription>
                           </div>
                           <Button variant="secondary" className="w-full bg-white text-primary font-black text-lg rounded-2xl shadow-xl border-none hover:bg-slate-50 py-7">
                              Find Matches
                           </Button>
                        </div>
                     </Card>
                  </motion.div>
               </Link>

               {/* SMALL CARD: Messages / Events Combined Style */}
               <div className="md:col-span-4 grid grid-cols-2 gap-4">
                  <Link to="/chat" className="group h-full">
                     <motion.div variants={item} className="h-full">
                        <Card className="h-full border-none shadow-2xl bento-item glass-card hover:bg-white transition-all duration-300 rounded-[2rem] p-6 flex flex-col justify-between group-hover:scale-105">
                           <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                              <MessageSquare size={28} />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-black tracking-tighter mb-1">Messages</CardTitle>
                              <CardDescription className="text-xs font-bold uppercase opacity-60">2 New Alerts</CardDescription>
                           </div>
                        </Card>
                     </motion.div>
                  </Link>

                  <Link to="/profile" className="group h-full">
                     <motion.div variants={item} className="h-full">
                        <Card className="h-full border-none shadow-2xl bento-item glass-card hover:bg-white transition-all duration-300 rounded-[2rem] p-6 flex flex-col justify-between group-hover:scale-105">
                           <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500">
                              <Calendar size={28} />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-black tracking-tighter mb-1">Events</CardTitle>
                              <CardDescription className="text-xs font-bold uppercase opacity-60">Coming Soon</CardDescription>
                           </div>
                        </Card>
                     </motion.div>
                  </Link>
               </div>
            </motion.div>
         </div>

         <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }
      `}</style>
      </div>
   );
};

export default Dashboard;
