import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Profile = () => {
   const { user, updateUser } = useAuth();
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState({
      name: '', email: '', university: '', city: '', country: '', budgetRange: '', bio: '', interests: ''
   });

   useEffect(() => {
      if (user) {
         setFormData({
            ...user,
            interests: user.interests ? user.interests.join(', ') : ''
         });
      }
   }, [user]);

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const dataToSubmit = {
            ...formData,
            interests: formData.interests.split(',').map(i => i.trim()),
         };
         const { data } = await api.put('/users/profile', dataToSubmit);
         updateUser(data);
         setIsEditing(false);
      } catch (error) {
         alert('Update failed');
      }
   };

   return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            <button
               onClick={() => setIsEditing(!isEditing)}
               className="text-primary-600 hover:text-primary-700 font-medium"
            >
               {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
         </div>

         <div className="flex items-center gap-6 mb-8">
            <img src={user?.profilePicture} className="w-24 h-24 rounded-full bg-slate-200 object-cover" />
            <div>
               <h2 className="text-xl font-bold">{user?.name}</h2>
               <p className="text-slate-500">{user?.university}</p>
            </div>
         </div>

         {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="label">Name</label>
                     <input name="name" value={formData.name} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                     <label className="label">University</label>
                     <input name="university" value={formData.university} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                     <label className="label">City</label>
                     <input name="city" value={formData.city} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                     <label className="label">Country</label>
                     <input name="country" value={formData.country} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                     <label className="label">Budget Range</label>
                     <input name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="input-field" />
                  </div>
                  <div className="col-span-2">
                     <label className="label">Interests</label>
                     <input name="interests" value={formData.interests} onChange={handleChange} className="input-field" />
                  </div>
                  <div className="col-span-2">
                     <label className="label">Bio</label>
                     <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field h-24" />
                  </div>
               </div>
               <button type="submit" className="btn-primary w-full">Save Changes</button>
            </form>
         ) : (
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                     <span className="block text-slate-400">Email</span>
                     <span className="font-medium">{user?.email}</span>
                  </div>
                  <div>
                     <span className="block text-slate-400">Location</span>
                     <span className="font-medium">{user?.city}, {user?.country}</span>
                  </div>
                  <div>
                     <span className="block text-slate-400">Budget</span>
                     <span className="font-medium">{user?.budgetRange}</span>
                  </div>
               </div>

               <div>
                  <span className="block text-slate-400 mb-2">Interests</span>
                  <div className="flex flex-wrap gap-2">
                     {user?.interests?.map((i, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 params rounded-full px-3 py-1 text-sm">{i}</span>
                     ))}
                  </div>
               </div>

               <div>
                  <span className="block text-slate-400 mb-2">Bio</span>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{user?.bio || 'No bio yet.'}</p>
               </div>
            </div>
         )}
      </div>
   );
};

export default Profile;
