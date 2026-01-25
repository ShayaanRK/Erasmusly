import { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star } from 'lucide-react';

const Roommates = () => {
   const [matches, setMatches] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchMatches = async () => {
         const { data } = await api.get('/users/matches');
         setMatches(data);
      };
      fetchMatches();
   }, []);

   const startChat = async (userId) => {
      try {
         const { data } = await api.post('/chat', { userId });
         navigate(`/chat?id=${data._id}`); // Pass chat ID to pre-select
      } catch (error) {
         console.error("Failed to start chat", error);
      }
   }

   return (
      <div>
         <h2 className="text-2xl font-bold text-slate-800 mb-6">Top Matches for You</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={match._id}
                  className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center relative card-hover"
               >
                  <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                     <Star size={12} fill="currentColor" /> {match.score} pts
                  </div>

                  <img
                     src={match.profilePicture || 'https://via.placeholder.com/150'}
                     alt={match.name}
                     className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary-50"
                  />
                  <h3 className="font-bold text-lg">{match.name}</h3>
                  <p className="text-slate-500 text-sm mb-1">{match.university}</p>
                  <p className="text-slate-400 text-xs mb-4">{match.city}, {match.country}</p>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                     {match.interests?.slice(0, 3).map((interest, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
                           {interest}
                        </span>
                     ))}
                  </div>

                  <button
                     onClick={() => startChat(match._id)}
                     className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                     <MessageSquare size={18} /> Chat
                  </button>
               </motion.div>
            ))}
         </div>
         {matches.length === 0 && (
            <div className="text-center text-slate-500 py-12">
               No matches found yet. Try updating your profile interests!
            </div>
         )}
      </div>
   );
};

export default Roommates;
