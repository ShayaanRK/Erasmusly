import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, MessageSquare, Heart, User, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   NavigationMenu,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const Navbar = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const isActive = (path) => location.pathname === path;

   if (!user) return null;

   return (
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto flex h-20 items-center justify-between">
            {/* BRAND LOGO AREA */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
               <div className="bg-gradient-to-tr from-primary to-secondary rounded-xl p-2 shadow-xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-300">
                  <Globe className="text-white h-7 w-7" />
               </div>
               <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Erasmusly
               </span>
            </div>

            {/* Desktop Navigation - Enhanced spacing */}
            <div className="hidden md:block">
               <NavigationMenu>
                  <NavigationMenuList className="gap-2">
                     <NavItem to="/" icon={<Home className="h-4 w-4" />} label="Home" active={isActive('/')} />
                     <NavItem to="/housing" icon={<MapPin className="h-4 w-4" />} label="Housing" active={isActive('/housing')} />
                     <NavItem to="/roommates" icon={<Heart className="h-4 w-4" />} label="Matches" active={isActive('/roommates')} />
                     <NavItem to="/chat" icon={<MessageSquare className="h-4 w-4" />} label="Chat" active={isActive('/chat')} />
                     <NavItem to="/profile" icon={<User className="h-4 w-4" />} label="Profile" active={isActive('/profile')} />
                  </NavigationMenuList>
               </NavigationMenu>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 backdrop-blur-sm rounded-full border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{user.city || 'Global'}</span>
               </div>
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
               >
                  <LogOut className="h-5 w-5" />
               </Button>
            </div>
         </div>

         {/* Mobile Bottom Navigation */}
         <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 px-6 py-3 flex justify-between items-center z-50">
            <MobileNavItem to="/" icon={<Home className="h-6 w-6" />} active={isActive('/')} />
            <MobileNavItem to="/housing" icon={<MapPin className="h-6 w-6" />} active={isActive('/housing')} />
            <MobileNavItem to="/roommates" icon={<Heart className="h-6 w-6" />} active={isActive('/roommates')} activeColor="bg-primary" />
            <MobileNavItem to="/chat" icon={<MessageSquare className="h-6 w-6" />} active={isActive('/chat')} />
            <MobileNavItem to="/profile" icon={<User className="h-6 w-6" />} active={isActive('/profile')} />
         </nav>
      </header>
   );
};

const NavItem = ({ to, icon, label, active }) => (
   <NavigationMenuItem>
      <Link to={to}>
         <NavigationMenuLink className={cn(
            navigationMenuTriggerStyle(),
            "bg-transparent hover:bg-slate-100/50 transition-colors gap-2",
            active && "bg-slate-100 font-bold text-primary"
         )}>
            {icon}
            <span>{label}</span>
         </NavigationMenuLink>
      </Link>
   </NavigationMenuItem>
)

const MobileNavItem = ({ to, icon, active, activeColor = "bg-primary" }) => (
   <Link to={to} className={cn(
      "p-2 rounded-2xl transition-all duration-300",
      active ? `${activeColor} text-white shadow-lg -translate-y-1` : "text-slate-400"
   )}>
      {icon}
   </Link>
)

export default Navbar;
