import { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Sparkles, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
               <Sparkles className="text-primary h-8 w-8" />
               Top Matches for You
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Based on your shared interests and university</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match, index) => (
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  key={match._id}
               >
                  <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col group relative">
                     {/* Match Score Badge */}
                     <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-primary/95 text-white border-none px-3 py-1 font-black shadow-lg shadow-primary/20">
                           <Star size={14} fill="white" className="mr-1.5" /> {match.score} PTS
                        </Badge>
                     </div>

                     <CardHeader className="flex flex-col items-center pt-10 pb-6 relative">
                        {/* Background Decoration */}
                        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>

                        <Avatar className="w-28 h-28 border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                           <AvatarImage src={match.profilePicture} alt={match.name} className="object-cover" />
                           <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                              {match.name?.charAt(0) || 'U'}
                           </AvatarFallback>
                        </Avatar>

                        <div className="mt-4 text-center">
                           <h3 className="font-bold text-2xl text-slate-900">{match.name}</h3>
                           <p className="text-primary font-bold text-sm tracking-wide uppercase mt-1">{match.university}</p>
                        </div>
                     </CardHeader>

                     <CardContent className="flex-grow flex flex-col items-center px-6">
                        <div className="flex items-center text-slate-400 text-xs mb-6 font-bold uppercase tracking-widest">
                           <MapPin size={12} className="mr-1.5" /> {match.city}, {match.country}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                           {match.interests?.slice(0, 4).map((interest, i) => (
                              <Badge key={i} variant="secondary" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                                 {interest}
                              </Badge>
                           ))}
                        </div>
                     </CardContent>

                     <CardFooter className="p-6 pt-2">
                        <Button
                           onClick={() => startChat(match._id)}
                           className="w-full rounded-2xl h-14 font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                           <MessageSquare size={20} />
                           Say Hello
                        </Button>
                     </CardFooter>
                  </Card>
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
