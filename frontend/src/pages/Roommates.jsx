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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
         <div className="mb-12 text-center md:text-left space-y-3">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4 font-display">
               <div className="vibrant-gradient p-2.5 rounded-2xl shadow-vibrant">
                  <Sparkles className="text-white h-7 w-7" />
               </div>
               Top Matches
            </h2>
            <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">Intelligent pairings based on your shared interests, university, and budget.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
            {matches.map((match, index) => (
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  key={match._id}
               >
                  <Card className="overflow-hidden border-none shadow-premium hover:shadow-vibrant transition-all duration-500 h-full flex flex-col group relative rounded-[3rem] bg-white">
                     {/* Match Score Badge */}
                     <div className="absolute top-6 right-6 z-10">
                        <Badge className="bg-primary text-white border-none px-4 py-2 font-black shadow-vibrant rounded-xl text-xs flex items-center gap-2">
                           <Star size={14} fill="white" className="animate-pulse" /> {match.score} PTS
                        </Badge>
                     </div>

                     <CardHeader className="flex flex-col items-center pt-14 pb-8 relative">
                        {/* Background Decoration */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent -z-10 opacity-50"></div>

                        <Avatar className="w-32 h-32 border-[6px] border-white shadow-premium group-hover:scale-105 transition-transform duration-700">
                           <AvatarImage src={match.profilePicture} alt={match.name} className="object-cover" />
                           <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary uppercase">
                              {match.name?.charAt(0) || 'U'}
                           </AvatarFallback>
                        </Avatar>

                        <div className="mt-6 text-center space-y-1">
                           <h3 className="font-black text-3xl text-slate-900 font-display tracking-tight">{match.name}</h3>
                           <p className="text-primary font-black text-[10px] tracking-[0.2em] uppercase bg-primary/5 px-4 py-1 rounded-full border border-primary/10 inline-block">{match.university}</p>
                        </div>
                     </CardHeader>

                     <CardContent className="flex-grow flex flex-col items-center px-8">
                        <div className="flex items-center text-slate-400 text-[10px] mb-8 font-black uppercase tracking-[0.2em]">
                           <MapPin size={14} className="mr-2 text-primary/40" /> {match.city}, {match.country}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                           {match.interests?.slice(0, 4).map((interest, i) => (
                              <Badge key={i} variant="secondary" className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100/50 hover:bg-primary/10 hover:text-primary transition-all cursor-default rounded-xl">
                                 {interest}
                              </Badge>
                           ))}
                        </div>
                     </CardContent>

                     <CardFooter className="p-8 pt-2">
                        <Button
                           onClick={() => startChat(match._id)}
                           className="w-full rounded-2xl h-16 font-black text-xs uppercase tracking-[0.2em] shadow-vibrant hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
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
