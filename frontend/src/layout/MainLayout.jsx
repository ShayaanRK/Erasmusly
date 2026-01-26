import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { cn } from "@/lib/utils";

const MainLayout = () => {
   const location = useLocation();
   const isChat = location.pathname === '/chat';

   return (
      <div className="min-h-screen bg-slate-50 relative w-full px-4 sm:px-6 lg:px-8">
         <Navbar />
         <main className={cn(
            "transition-all duration-300 w-full relative",
            isChat ? "h-[calc(100vh-80px)] overflow-hidden" : "pt-6 pb-12"
         )}>
            <Outlet />
         </main>
      </div>
   );
};

export default MainLayout;
