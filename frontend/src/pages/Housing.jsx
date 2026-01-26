import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, DollarSign, Home, Building2, Loader2 } from 'lucide-react';
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
   const [loading, setLoading] = useState(true);
   const [creating, setCreating] = useState(false);
   const [formData, setFormData] = useState({
      title: '', description: '', price: '', city: '', address: ''
   });
   const { user } = useAuth();

   const fetchPosts = async () => {
      setLoading(true);
      try {
         const { data } = await api.get(`/housing?city=${user?.city || ''}`); // Default to user's city
         setPosts(data || []);
      } catch (error) {
         console.error("Failed to fetch posts", error);
         toast.error(error.response?.data?.message || 'Failed to load housing posts');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (user?.city) {
         fetchPosts();
      }
   }, [user?.city]);

   const handleCreate = async (e) => {
      e.preventDefault();

      // Validate required fields
      if (!formData.title.trim() || !formData.price || !formData.city.trim() || !formData.description.trim()) {
         toast.error('Please fill in all required fields');
         return;
      }

      // Validate price
      if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
         toast.error('Please enter a valid price');
         return;
      }

      setCreating(true);
      try {
         // Default image for new posts if none provided
         const submissionData = {
            ...formData,
            title: formData.title.trim(),
            city: formData.city.trim(),
            description: formData.description.trim(),
            address: formData.address.trim(),
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000']
         };
         await api.post('/housing', submissionData);
         toast.success('Housing post created successfully!');
         setShowCreate(false);
         setFormData({ title: '', description: '', price: '', city: '', address: '' });
         fetchPosts();
      } catch (error) {
         console.error("Creation error:", error.response?.data || error.message);
         toast.error(error.response?.data?.message || 'Failed to create post');
      } finally {
         setCreating(false);
      }
   }

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
               <h2 className="text-5xl font-black text-slate-900 tracking-tight font-display">Experience {user.city}</h2>
               <p className="text-slate-500 text-lg font-medium">Verified apartments and shared spaces for the global community.</p>
            </div>
            <Button
               onClick={() => setShowCreate(!showCreate)}
               className="rounded-2xl px-8 h-14 shadow-vibrant hover:scale-105 active:scale-95 transition-all font-black text-xs uppercase tracking-[0.2em]"
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
                  <Card className="border-none shadow-premium rounded-[2.5rem] bg-white">
                     <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-3xl font-black font-display uppercase tracking-tight">Post Your Space</CardTitle>
                        <CardDescription className="text-lg font-medium">Help a student find their home in {user.city}.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-8 pt-4">
                        <form onSubmit={handleCreate} className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Listing Title</label>
                                 <Input placeholder="Modern loft with city views" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold" />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Price / month</label>
                                 <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black">€</span>
                                    <Input placeholder="500" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required className="h-14 pl-10 rounded-2xl bg-slate-50 border-none shadow-inner font-bold" />
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">City</label>
                                 <Input placeholder="e.g. Valencia" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold" />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Exact Address</label>
                                 <Input placeholder="Calle Principal, 123" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold" />
                              </div>
                              <div className="space-y-3 col-span-1 md:col-span-2">
                                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Description & Rules</label>
                                 <Textarea placeholder="Describe the roommates, neighborhood vibes, and proximity to campus..." className="min-h-[160px] rounded-[2rem] bg-slate-50 border-none shadow-inner py-6 px-6 font-medium resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                              </div>
                           </div>
                           <div className="flex justify-end gap-4 pt-6">
                              <Button variant="ghost" type="button" onClick={() => setShowCreate(false)} className="rounded-xl px-8 h-14 font-black text-xs uppercase text-slate-400">Cancel</Button>
                              <Button
                                 type="submit"
                                 disabled={creating || !formData.title.trim() || !formData.price || !formData.city.trim() || !formData.description.trim()}
                                 className="rounded-2xl px-12 h-14 font-black text-xs uppercase tracking-widest shadow-vibrant disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 {creating ? (
                                    <>
                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                       Publishing...
                                    </>
                                 ) : (
                                    'Publish Listing'
                                 )}
                              </Button>
                           </div>
                        </form>
                     </CardContent>
                  </Card>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
            {posts.map((post) => (
               <motion.div
                  layout
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4 }}
               >
                  <Card className="overflow-hidden border-none shadow-premium hover:shadow-vibrant transition-all duration-500 h-full flex flex-col group rounded-[2.5rem] bg-white">
                     <div className="h-64 relative overflow-hidden shrink-0">
                        <img
                           src={(post.images && post.images.length > 0) ? post.images[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000"}
                           alt={post.title}
                           className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6">
                           <Badge className="bg-white/95 backdrop-blur-md text-primary font-black px-4 py-2 rounded-xl shadow-lg border-none animate-in fade-in zoom-in duration-500">
                              €{post.price}<span className="text-[10px] ml-1 opacity-50 font-medium">/month</span>
                           </Badge>
                        </div>
                     </div>
                     <CardHeader className="p-8 pb-3">
                        <div className="flex items-center text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                           <Building2 size={16} className="mr-2" /> Entire Property
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1 font-display leading-tight">{post.title}</CardTitle>
                     </CardHeader>
                     <CardContent className="px-8 py-3 flex-grow">
                        <div className="flex items-center text-slate-400 text-sm mb-6 font-bold uppercase tracking-widest">
                           <MapPin size={16} className="mr-2 text-primary/40" /> {post.city}
                        </div>
                        <p className="text-slate-600 text-base leading-relaxed line-clamp-3 font-medium">{post.description}</p>
                     </CardContent>
                     <CardFooter className="px-8 py-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                           <Avatar className="size-8 border-2 border-white shadow-sm">
                              <AvatarImage src={post.createdBy?.profilePicture} alt={post.createdBy?.name} />
                              <AvatarFallback className="text-xs bg-primary text-white font-black">
                                 {post.createdBy?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                           </Avatar>
                           <span className="text-sm font-black text-slate-700 font-display uppercase tracking-tight tracking-wide">{post.createdBy?.name || 'Anonymous'}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{new Date(post.createdAt).toLocaleDateString()}</span>
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
