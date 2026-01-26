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
            <div className="absolute inset-0 z-0 bg-slate-950">
               <img
                  src="https://www.cems.org/sites/default/files/styles/ct_school_profile_main_image/public/2020-07/EUR%20Campus%202018%201.jpg?auto=format&fit=crop&q=80&w=2070"
                  className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60"
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
                     <span>Custom Erasmus Student Portal</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                     Hello, <span className="text-primary">{user?.name || 'Explorer'}</span> <br />
                     Find your <span className="text-gradient">Community</span>
                  </h1>
                  <p className="text-slate-200 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12 opacity-90 font-medium">
                     Seamlessly connect with fellow students{user?.city ? ` in ${user.city}` : ''},
                     secure verified housing, and discover local adventures.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                     <Link to="/roommates">
                        <Button size="lg" className="h-16 px-10 text-xl font-black rounded-2xl shadow-2xl shadow-primary/40 group">
                           Find Roommates <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                     </Link>
                     <Link to="/events">
                        <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-black rounded-2xl bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all">
                           Events
                        </Button>
                     </Link>
                  </div>
               </motion.div>
            </div>
         </section>

         {/* --- DASHBOARD CONTENT --- */}
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="h-1.5 w-16 bg-primary rounded-full shadow-[0_0_12px_var(--primary)]" />
                     <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Your Command Center</span>
                  </div>
                  <h2 className="text-5xl font-black tracking-tight text-slate-900 font-display">Your Student Portal</h2>
                  <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">Everything you need to navigate your Erasmus life, from housing to matching.</p>
               </div>

               <div className="flex items-center gap-2 text-green-700 bg-green-500/10 px-5 py-2.5 rounded-2xl border border-green-200/50 font-black text-xs uppercase tracking-widest shadow-sm backdrop-blur-sm group hover:scale-105 transition-all cursor-default">
                  <ShieldCheck className="size-4" />
                  <span>Secure Account</span>
               </div>
            </div>

            {/* --- BENTO GRID LAYOUT --- */}
            <motion.div
               variants={container}
               initial="hidden"
               animate="show"
               className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-10"
            >
               {/* LARGE CARD: Housing (Featured) */}
               <Link to="/housing" className="md:col-span-8 md:row-span-2 group">
                  <motion.div variants={item} className="h-full">
                     <Card className="h-full overflow-hidden border-none shadow-premium hover:shadow-vibrant bento-item transition-all duration-700 rounded-[3rem] bg-white">
                        <div className="relative h-[65%] overflow-hidden">
                           <img
                              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                              alt="Housing"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                           <div className="absolute top-8 left-8">
                              <div className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 shadow-xl border border-white/40">
                                 <TrendingUp className="size-3.5" />
                                 <span>Curated Spaces</span>
                              </div>
                           </div>
                        </div>
                        <div className="p-10 space-y-5">
                           <div className="flex items-center gap-4">
                              <div className="p-3.5 bg-primary/10 rounded-[1.25rem]">
                                 <Home className="text-primary size-8" />
                              </div>
                              <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter font-display uppercase">Verified Housing</CardTitle>
                           </div>
                           <CardDescription className="text-xl font-medium text-slate-600 leading-[1.6]">
                              Find a safe, verified home for your semester. We've vetted every listing for your peace of mind.
                           </CardDescription>
                        </div>
                     </Card>
                  </motion.div>
               </Link>

               {/* MEDIUM CARD: Roommates */}
               <Link to="/roommates" className="md:col-span-4 group">
                  <motion.div variants={item} className="h-full">
                     <Card className="h-full border-none shadow-premium bg-gradient-to-br from-primary via-primary to-brand-700 text-white bento-item overflow-hidden relative rounded-[3rem]">
                        <div className="absolute -right-16 -bottom-16 opacity-10 group-hover:opacity-20 transition-all duration-700 rotate-[15deg]">
                           <Users size={280} />
                        </div>
                        <div className="p-10 h-full flex flex-col justify-between relative z-10">
                           <div className="space-y-5">
                              <div className="p-4 bg-white/10 w-fit rounded-2xl backdrop-blur-xl border border-white/20">
                                 <Users className="size-8" />
                              </div>
                              <CardTitle className="text-4xl font-black tracking-tighter font-display uppercase">Matches</CardTitle>
                              <CardDescription className="text-white/80 text-lg font-medium leading-relaxed">
                                 Connect with your future best friends. Match by university, interests, and vibes.
                              </CardDescription>
                           </div>
                           <Button variant="secondary" className="w-full h-16 bg-white text-primary font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl border-none hover:bg-slate-50 transition-all">
                              Start Matching
                           </Button>
                        </div>
                     </Card>
                  </motion.div>
               </Link>

               {/* SMALL CARDS: Messages / Events Combined Style */}
               <div className="md:col-span-4 grid grid-cols-2 gap-6">
                  <Link to="/chat" className="group h-full">
                     <motion.div variants={item} className="h-full">
                        <Card className="h-full border-none shadow-premium bento-item bg-white/40 backdrop-blur-xl hover:bg-white transition-all duration-500 rounded-[2.5rem] p-8 flex flex-col justify-between">
                           <div className="size-16 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                              <MessageSquare size={32} />
                           </div>
                           <div className="space-y-1">
                              <CardTitle className="text-2xl font-black tracking-tighter font-display uppercase">Inbox</CardTitle>
                              <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Connect Now</CardDescription>
                           </div>
                        </Card>
                     </motion.div>
                  </Link>

                  <Link to="/events" className="group h-full">
                     <motion.div variants={item} className="h-full">
                        <Card className="h-full border-none shadow-premium bento-item bg-white/40 backdrop-blur-xl hover:bg-white transition-all duration-500 rounded-[2.5rem] p-8 flex flex-col justify-between">
                           <div className="size-16 bg-brand-500/10 text-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                              <Calendar size={32} />
                           </div>
                           <div className="space-y-1">
                              <CardTitle className="text-2xl font-black tracking-tighter font-display uppercase">Events</CardTitle>
                              <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Join Local</CardDescription>
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
