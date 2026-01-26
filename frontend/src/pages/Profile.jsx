import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Separator } from "../components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Mail, MapPin, Wallet, MessageSquare, Pencil, X, Save, University, Globe, Loader2, Sparkles, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils";

const InfoRow = ({ icon, text, label }) => (
   <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-slate-100/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:bg-white/80 group">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
         {icon}
      </div>
      <div className="flex flex-col">
         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
         <span className="text-sm font-bold text-slate-700">{text || 'N/A'}</span>
      </div>
   </div>
)

export default function Profile() {
   const { user: authUser, updateUser } = useAuth();
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isEditing, setIsEditing] = useState(false);
   const [saving, setSaving] = useState(false);
   const [formData, setFormData] = useState({
      name: '',
      university: '',
      city: '',
      country: '',
      budgetRange: '',
      interests: '',
      bio: ''
   });

   useEffect(() => {
      fetchProfile();
   }, []);

   const fetchProfile = async () => {
      try {
         const { data } = await api.get('/users/profile');
         setProfile(data);
         setFormData({
            name: data.name || '',
            university: data.university || '',
            city: data.city || '',
            country: data.country || '',
            budgetRange: data.budgetRange || '',
            interests: data.interests?.join(', ') || '',
            bio: data.bio || ''
         });
      } catch (error) {
         console.error("Failed to fetch profile:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
         const payload = {
            ...formData,
            interests: formData.interests.split(',').map(i => i.trim()).filter(i => i !== '')
         };
         const { data } = await api.patch('/users/profile', payload);

         // In a real app, the API might return the updated user. 
         // Based on backend code, it returns basic info + token.
         // Let's re-fetch the full profile to be safe and update UI.
         await fetchProfile();
         updateUser(data); // Sync AuthContext
         setIsEditing(false);
      } catch (error) {
         console.error("Update failed:", error);
         alert("Failed to update profile. Please try again.");
      } finally {
         setSaving(false);
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="h-12 w-12 text-primary animate-spin" />
               <p className="text-slate-500 font-medium animate-pulse">Loading your profile...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-6xl mx-auto space-y-10">

            {/* Header / Hero Section */}
            <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-primary to-purple-600 animate-gradient-x" />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
               <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

               <div className="absolute top-8 right-8">
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
                     <Sparkles size={14} className="mr-2" /> Erasmusly Member
                  </Badge>
               </div>
            </div>

            <div className="max-w-5xl mx-auto -mt-32 relative px-4 md:px-0">
               <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white/80 backdrop-blur-xl">
                  <CardContent className="p-0">
                     <div className="flex flex-col md:flex-row items-center md:items-end justify-between p-8 md:p-12 gap-8 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                           <div className="relative -mt-20 md:-mt-24 -bottom-1/2 translate-y-[20%] z-10">
                              <Avatar className="w-40 h-40 md:w-48 md:h-48 ring-[12px] ring-white shadow-2xl">
                                 <AvatarImage src={profile?.profilePicture} className="object-cover" />
                                 <AvatarFallback className="bg-primary text-white text-5xl font-black">{profile?.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
                           </div>
                           <div className="text-center md:text-left space-y-2">
                              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{profile?.name}</h1>
                              <p className="text-lg text-primary font-bold flex items-center justify-center md:justify-start gap-2">
                                 <University size={20} />
                                 {profile?.university}
                              </p>
                              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                                 <Badge variant="outline" className="border-slate-200 text-slate-500 font-semibold px-4 py-1.5 rounded-full bg-slate-50/50">
                                    <MapPin size={14} className="mr-1.5" /> {profile?.city}, {profile?.country}
                                 </Badge>
                              </div>
                           </div>
                        </div>

                        <Button
                           variant={isEditing ? "ghost" : "default"}
                           size="lg"
                           onClick={() => setIsEditing(!isEditing)}
                           className={cn(
                              "rounded-2xl px-8 h-14 font-black text-sm uppercase tracking-widest transition-all",
                              !isEditing && "bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95",
                              isEditing && "text-slate-500 hover:bg-slate-100"
                           )}
                        >
                           {isEditing ? (
                              <>
                                 <X size={20} className="mr-2" /> Cancel
                              </>
                           ) : (
                              <>
                                 <Pencil size={18} className="mr-2" /> Edit Profile
                              </>
                           )}
                        </Button>
                     </div>

                     <div className="p-8 md:p-12 bg-slate-50/30">
                        {isEditing ? (
                           /* ================= EDIT MODE ================= */
                           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6 md:col-span-2">
                                 <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <UserIcon size={24} className="text-primary" /> Personal Information
                                 </h3>
                                 <Separator />
                              </div>

                              <div className="space-y-4">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                 <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="h-14 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold shadow-sm" required />
                              </div>

                              <div className="space-y-4">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">University</label>
                                 <Input name="university" value={formData.university} onChange={handleChange} placeholder="University of Valencia" className="h-14 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold shadow-sm" required />
                              </div>

                              <div className="space-y-4">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                                 <Input name="city" value={formData.city} onChange={handleChange} placeholder="Valencia" className="h-14 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold shadow-sm" required />
                              </div>

                              <div className="space-y-4">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
                                 <Input name="country" value={formData.country} onChange={handleChange} placeholder="Spain" className="h-14 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold shadow-sm" required />
                              </div>

                              <div className="space-y-4">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Monthly Budget</label>
                                 <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">€</span>
                                    <Input name="budgetRange" value={formData.budgetRange} onChange={handleChange} placeholder="500" className="h-14 pl-10 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold shadow-sm" />
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Interests</label>
                                 <Input name="interests" value={formData.interests} onChange={handleChange} placeholder="Travel, Coding, Music, Sports" className="h-14 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold shadow-sm" />
                                 <p className="text-[10px] text-slate-400 font-bold uppercase ml-1">Separate with commas</p>
                              </div>

                              <div className="space-y-4 md:col-span-2">
                                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">About Your Erasmus Journey</label>
                                 <Textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." className="min-h-[160px] rounded-[2rem] bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium p-6 resize-none shadow-sm" />
                              </div>

                              <div className="md:col-span-2 flex justify-end gap-4 pt-6">
                                 <Button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-2xl h-14 px-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                                 >
                                    {saving ? (
                                       <>
                                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                                       </>
                                    ) : (
                                       <>
                                          <Save size={18} className="mr-2" /> Save Changes
                                       </>
                                    )}
                                 </Button>
                              </div>
                           </form>
                        ) : (
                           /* ================= VIEW MODE ================= */
                           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                              {/* Left Column: Stats & Contact */}
                              <div className="lg:col-span-4 space-y-8">
                                 <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Quick Contact</h3>
                                    <div className="space-y-4 font-bold">
                                       <InfoRow icon={<Mail size={20} />} label="Email Address" text={profile?.email} />
                                       <InfoRow icon={<Globe size={20} />} label="Location" text={`${profile?.city || 'No City'}, ${profile?.country || 'No Country'}`} />
                                       <InfoRow icon={<Wallet size={20} />} label="Max Budget" text={profile?.budgetRange ? `€${profile.budgetRange}/mo` : 'Not Specified'} />
                                    </div>
                                 </div>

                                 <Card className="rounded-[2rem] border-none shadow-sm bg-gradient-to-br from-primary to-indigo-600 p-1 text-white">
                                    <CardContent className="bg-white/10 backdrop-blur-md rounded-[1.8rem] p-8 space-y-4">
                                       <h4 className="font-black text-lg tracking-tight">Need a change?</h4>
                                       <p className="text-white/80 text-xs font-medium leading-relaxed">Your profile helps us find the best roommates and housing options tailored for you.</p>
                                       <Button variant="secondary" className="w-full rounded-xl font-bold text-xs uppercase" onClick={() => setIsEditing(true)}>Get Started</Button>
                                    </CardContent>
                                 </Card>
                              </div>

                              {/* Right Column: Bio & Interests */}
                              <div className="lg:col-span-8 space-y-12">
                                 <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                       <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                          <MessageSquare size={16} /> The Erasmus Experience
                                       </h3>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                                       <p className="text-slate-600 leading-[1.8] text-lg font-medium italic">
                                          "{profile?.bio || "This adventurer hasn't shared their story yet..."}"
                                       </p>
                                    </div>
                                 </section>

                                 <section className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Personal Interests</h3>
                                    <div className="flex flex-wrap gap-3">
                                       {profile?.interests && profile.interests.length > 0 ? (
                                          profile.interests.map((interest, i) => (
                                             <Badge
                                                key={i}
                                                variant="secondary"
                                                className="text-sm font-bold px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:border-primary hover:text-primary transition-all cursor-default"
                                             >
                                                {interest}
                                             </Badge>
                                          ))
                                       ) : (
                                          <p className="text-slate-400 font-medium italic">No interests listed yet.</p>
                                       )}
                                    </div>
                                 </section>
                              </div>
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
