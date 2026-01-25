import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, MessageSquare, Heart, User, MapPin } from 'lucide-react';

const Navbar = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const isActive = (path) => location.pathname === path ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50';

   if (!user) return null;

   return (
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 md:static md:border-b md:border-t-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
               <div className="hidden md:flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                     Erasmusly
                  </span>
               </div>

               <div className="flex w-full md:w-auto justify-around md:justify-end items-center space-x-0 md:space-x-4">
                  <Link to="/" className={`p-3 rounded-xl flex flex-col md:flex-row items-center gap-1 ${isActive('/')}`}>
                     <Home size={24} />
                     <span className="text-xs md:text-sm font-medium">Home</span>
                  </Link>

                  <Link to="/housing" className={`p-3 rounded-xl flex flex-col md:flex-row items-center gap-1 ${isActive('/housing')}`}>
                     <MapPin size={24} />
                     <span className="text-xs md:text-sm font-medium">Housing</span>
                  </Link>

                  <Link to="/roommates" className={`p-3 rounded-xl flex flex-col md:flex-row items-center gap-1 ${isActive('/roommates')}`}>
                     <Heart size={24} />
                     <span className="text-xs md:text-sm font-medium">Matches</span>
                  </Link>

                  <Link to="/chat" className={`p-3 rounded-xl flex flex-col md:flex-row items-center gap-1 ${isActive('/chat')}`}>
                     <MessageSquare size={24} />
                     <span className="text-xs md:text-sm font-medium">Chat</span>
                  </Link>

                  <Link to="/profile" className={`p-3 rounded-xl flex flex-col md:flex-row items-center gap-1 ${isActive('/profile')}`}>
                     <User size={24} />
                     <span className="text-xs md:text-sm font-medium">Profile</span>
                  </Link>

                  <button onClick={handleLogout} className="hidden md:flex p-2 text-slate-400 hover:text-red-500 transition-colors">
                     <LogOut size={20} />
                  </button>
               </div>
            </div>
         </div>
      </nav>
   );
};

export default Navbar;
