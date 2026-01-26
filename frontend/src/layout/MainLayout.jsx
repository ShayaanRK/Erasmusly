import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { cn } from "@/lib/utils";

const MainLayout = () => {
   const location = useLocation();
   const isChat = location.pathname === '/chat';

   return (
      <div className="min-h-screen bg-background relative w-full selection:bg-primary/20">
         {/* Decorative Background Elements */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-float opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full animate-float opacity-30" />
         </div>

         <Navbar />
         <main className={cn(
            "transition-all duration-500 w-full relative max-w-[1600px] mx-auto",
            isChat ? "h-[calc(100vh-80px)] overflow-hidden" : "px-4 sm:px-6 lg:px-10 pt-8 pb-20"
         )}>
            <div className={cn(!isChat && "animate-in fade-in slide-in-from-bottom-4 duration-1000")}>
               <Outlet />
            </div>
         </main>
      </div>
   );
};

export default MainLayout;
