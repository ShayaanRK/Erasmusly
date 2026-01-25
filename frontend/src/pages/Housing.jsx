import { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
         await api.post('/housing', formData);
         setShowCreate(false);
         setFormData({ title: '', description: '', price: '', city: '', address: '' });
         fetchPosts();
      } catch (error) {
         alert('Failed to creates post');
      }
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Housing in {user.city}</h2>
            <button
               onClick={() => setShowCreate(!showCreate)}
               className="btn-primary flex items-center gap-2"
            >
               <Plus size={20} /> Post Housing
            </button>
         </div>

         <AnimatePresence>
            {showCreate && (
               <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleCreate}
                  className="bg-white p-6 rounded-xl shadow-md space-y-4 overflow-hidden"
               >
                  <h3 className="font-semibold text-lg">Create New Listing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input placeholder="Title" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                     <input placeholder="Price / month" type="number" className="input-field" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                     <input placeholder="City" className="input-field" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                     <input placeholder="Address" className="input-field" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                     <textarea placeholder="Description" className="input-field col-span-2 h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                  </div>
                  <div className="flex justify-end gap-2">
                     <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                     <button type="submit" className="btn-primary">Post</button>
                  </div>
               </motion.form>
            )}
         </AnimatePresence>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
               <motion.div
                  layout
                  key={post._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
               >
                  <div className="h-48 bg-slate-200">
                     {/* Placeholder image logic */}
                     <img src={`https://source.unsplash.com/random/400x300/?apartment,${post.city}`} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-800">{post.title}</h3>
                        <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md font-semibold text-sm">
                           €{post.price}
                        </span>
                     </div>
                     <div className="flex items-center text-slate-500 text-sm mb-3">
                        <MapPin size={16} className="mr-1" /> {post.city}
                     </div>
                     <p className="text-slate-600 text-sm line-clamp-2 mb-4">{post.description}</p>

                     <div className="flex justify-between items-center text-xs text-slate-400 border-t pt-3">
                        <span>By {post.createdBy?.name}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                     </div>
                  </div>
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
