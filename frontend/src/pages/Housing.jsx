import { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, DollarSign, Home, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Housing = () => {
   const [posts, setPosts] = useState([]);
   const [showCreate, setShowCreate] = useState(false);
   const [formData, setFormData] = useState({
      title: '', description: '', price: '', city: '', address: ''
   });
   const { user } = useAuth();

   const fetchPosts = async () => {
      try {
         const { data } = await api.get(`/housing?city=${user.city}`); // Default to user's city
         setPosts(data);
      } catch (error) {
         console.error("Failed to fetch posts", error);
      }
   };

   useEffect(() => {
      fetchPosts();
   }, [user.city]);

   const handleCreate = async (e) => {
      e.preventDefault();
      try {
         // Default image for new posts if none provided
         const submissionData = {
            ...formData,
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000']
         };
         await api.post('/housing', submissionData);
         setShowCreate(false);
         setFormData({ title: '', description: '', price: '', city: '', address: '' });
         fetchPosts();
      } catch (error) {
         console.error("Creation error:", error.response?.data || error.message);
         alert('Failed to create post: ' + (error.response?.data?.message || error.message));
      }
   }

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Experience {user.city}</h2>
               <p className="text-slate-500 mt-1 font-medium">Find the perfect home for your Erasmus journey</p>
            </div>
            <Button
               onClick={() => setShowCreate(!showCreate)}
               className="rounded-full px-6 py-6 shadow-xl shadow-primary/20 transition-all hover:scale-105"
            >
               <Plus className="mr-2 h-5 w-5" /> Post Housing
            </Button>
         </div>

         <AnimatePresence>
            {showCreate && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
               >
                  <Card className="border-2 border-primary/10 shadow-2xl shadow-primary/5">
                     <CardHeader>
                        <CardTitle className="text-2xl font-bold">Create New Listing</CardTitle>
                        <CardDescription>Share your space with the Erasmus community</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <form onSubmit={handleCreate} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
                                 <Input placeholder="Cozy studio near city center" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="h-12 rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-semibold text-slate-700 ml-1">Price / month</label>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                                    <Input placeholder="500" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required className="h-12 pl-8 rounded-xl" />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-semibold text-slate-700 ml-1">City</label>
                                 <Input placeholder="Valencia" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required className="h-12 rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-semibold text-slate-700 ml-1">Address</label>
                                 <Input placeholder="Calle de la Paz, 12" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="h-12 rounded-xl" />
                              </div>
                              <div className="space-y-2 col-span-1 md:col-span-2">
                                 <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                                 <Textarea placeholder="Tell us about the room, roommates, and neighborhood..." className="min-h-[120px] rounded-xl py-3 resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                              </div>
                           </div>
                           <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button variant="ghost" type="button" onClick={() => setShowCreate(false)} className="rounded-xl px-6">Cancel</Button>
                              <Button type="submit" className="rounded-xl px-10">Post Listing</Button>
                           </div>
                        </form>
                     </CardContent>
                  </Card>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
               <motion.div
                  layout
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
               >
                  <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group">
                     <div className="h-56 relative overflow-hidden shrink-0">
                        <img
                           src={(post.images && post.images.length > 0) ? post.images[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000"}
                           alt={post.title}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                           <Badge className="bg-white/90 backdrop-blur-md text-primary font-bold px-3 py-1.5 rounded-xl shadow-sm hover:bg-white">
                              €{post.price}<span className="text-[10px] ml-1 opacity-60">/mo</span>
                           </Badge>
                        </div>
                     </div>
                     <CardHeader className="p-5 pb-2">
                        <div className="flex items-center text-primary text-xs font-bold uppercase tracking-wider mb-2">
                           <Building2 size={14} className="mr-1.5" /> Room In Apartment
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{post.title}</CardTitle>
                     </CardHeader>
                     <CardContent className="px-5 py-2 flex-grow">
                        <div className="flex items-center text-slate-500 text-sm mb-4 font-medium">
                           <MapPin size={16} className="mr-1.5 text-slate-400" /> {post.city}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{post.description}</p>
                     </CardContent>
                     <CardFooter className="px-5 py-4 border-t border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                           <Avatar className="w-6 h-6 border border-primary/10">
                              <AvatarImage src={post.createdBy?.profilePicture} alt={post.createdBy?.name} />
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                 {post.createdBy?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                           </Avatar>
                           <span className="text-xs font-semibold text-slate-700">By {post.createdBy?.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                     </CardFooter>
                  </Card>
               </motion.div>
            ))}
         </div>
         {posts.length === 0 && (
            <div className="text-center text-slate-500 py-12">
               No housing posts found in {user.city}. Be the first to post!
            </div>
         )}
      </div>
   );
};

export default Housing;
