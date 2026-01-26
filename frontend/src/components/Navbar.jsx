import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, MessageSquare, Heart, User, MapPin, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Separator } from '@radix-ui/react-separator';

const Navbar = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   if (!user) return null;

   const isActive = (path) => location.pathname === path;

   return (
      <header className="sticky top-6 z-50 w-full max-w-7xl mx-auto flex h-20 items-center justify-between px-6 premium-glass rounded-[2rem] mt-6 transition-all duration-500 hover:shadow-primary/5">
         <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="vibrant-gradient rounded-2xl p-2.5 shadow-2xl shadow-primary/30 group-hover:rotate-[15deg] transition-all duration-500">
               <Globe className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-vibrant">
               Erasmusly
            </span>
         </div>

         <div className="hidden lg:block">
            <NavigationMenu>
               <NavigationMenuList className="gap-1">
                  <NavItem to="/" icon={<Home className="size-4" />} label="Home" active={isActive('/')} />
                  <NavItem to="/housing" icon={<MapPin className="size-4" />} label="Housing" active={isActive('/housing')} />
                  <NavItem to="/roommates" icon={<Heart className="size-4" />} label="Matches" active={isActive('/roommates')} />
                  <NavItem to="/events" icon={<Calendar className="size-4" />} label="Events" active={isActive('/events')} />
                  <NavItem to="/chat" icon={<MessageSquare className="size-4" />} label="Chat" active={isActive('/chat')} />
                  <NavItem to="/profile" icon={<User className="size-4" />} label="Profile" active={isActive('/profile')} />
               </NavigationMenuList>
            </NavigationMenu>
         </div>

         <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-slate-500/5 backdrop-blur-md rounded-2xl border border-white/40">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_oklch(0.6_0.2_150)]" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{user.city || 'Global'}</span>
            </div>
            <Separator orientation="vertical" className="h-6 mx-1 opacity-20 hidden md:block" />
            <Button
               variant="ghost"
               size="icon"
               onClick={() => { logout(); navigate('/login'); }}
               className="rounded-2xl transition-all duration-300 hover:bg-destructive/10 hover:text-destructive group"
            >
               <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
         </div>

         {/* Mobile Navigation - Compact & Modern */}
         <nav className="lg:hidden fixed bottom-6 left-6 right-6 premium-glass h-16 rounded-[1.5rem] px-6 flex justify-between items-center z-50 border-t-0">
            <MobileNavItem to="/" icon={<Home className="size-5" />} active={isActive('/')} />
            <MobileNavItem to="/housing" icon={<MapPin className="size-5" />} active={isActive('/housing')} />
            <MobileNavItem to="/roommates" icon={<Heart className="size-5" />} active={isActive('/roommates')} />
            <MobileNavItem to="/events" icon={<Calendar className="size-5" />} active={isActive('/events')} />
            <MobileNavItem to="/chat" icon={<MessageSquare className="size-5" />} active={isActive('/chat')} />
            <MobileNavItem to="/profile" icon={<User className="size-5" />} active={isActive('/profile')} />
         </nav>
      </header>
   );
};

const NavItem = ({ to, icon, label, active }) => (
   <NavigationMenuItem>
      <Link to={to}>
         <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent gap-2", active && "bg-slate-100 font-bold text-primary")}>
            {icon} <span>{label}</span>
         </NavigationMenuLink>
      </Link>
   </NavigationMenuItem>
);

const MobileNavItem = ({ to, icon, active }) => (
   <Link to={to} className={cn(
      "p-2 rounded-2xl transition-all duration-300",
      active ? "bg-primary text-white shadow-lg -translate-y-1" : "text-slate-400"
   )}>
      {icon}
   </Link>
)

export default Navbar;
