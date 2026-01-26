import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Events = () => {
   const [events, setEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const { user } = useAuth();

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            const { data } = await api.get('/events');
            setEvents(data || []);
         } catch (error) {
            console.error("Failed to fetch events", error);
            toast.error(error.response?.data?.message || 'Failed to load events');
         } finally {
            setLoading(false);
         }
      };
      fetchEvents();
   }, []);

   const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
         weekday: 'short',
         month: 'short',
         day: 'numeric',
      });
   };

   const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Events List</h2>
               <p className="text-slate-500 font-medium">Discover what's happening in your Erasmus community.</p>
            </div>
            <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg shadow-primary/20">
               <Plus size={20} /> Create Event
            </button>
         </div>

         {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {events.map((event, index) => (
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     key={event._id}
                     className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                     <div className="h-48 bg-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex flex-col items-center shadow-lg border border-white/20">
                           <span className="text-xs font-black uppercase text-slate-400 leading-none">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                           </span>
                           <span className="text-xl font-black text-primary leading-none">
                              {new Date(event.date).getDate()}
                           </span>
                        </div>
                     </div>

                     <div className="p-8 space-y-6">
                        <div className="space-y-2">
                           <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                              {event.title}
                           </h3>
                           <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                              {event.description}
                           </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                           <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                 <Clock size={16} className="text-slate-400" />
                              </div>
                              {formatTime(event.date)}
                           </div>
                           <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                 <MapPin size={16} className="text-slate-400" />
                              </div>
                              {event.location}
                           </div>
                           <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                 <User size={16} className="text-slate-400" />
                              </div>
                              Host: {event.createdBy?.name || 'Community'}
                           </div>
                        </div>

                        <button className="w-full py-4 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-inner">
                           Join Event
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         )}

         {!loading && events.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <Calendar size={64} className="mx-auto text-slate-200 mb-6" />
               <h3 className="text-2xl font-black text-slate-900 mb-2">No events found</h3>
               <p className="text-slate-400 font-medium">Be the first player to organize something!</p>
            </div>
         )}
      </div>
   );
};

export default Events;
