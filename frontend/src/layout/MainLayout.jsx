import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { cn } from "@/lib/utils";

const MainLayout = () => {
   const location = useLocation();
   const isDashboard = location.pathname === '/';
   const isChat = location.pathname === '/chat';
   const noPadding = isDashboard || isChat;

   return (
      <div className={cn(
         "bg-slate-50 relative w-full",
         isChat ? "h-screen overflow-hidden" : "min-h-screen"
      )}>
         {/* PREMIUM BACKGROUND TEXTURE */}
         <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]"
            style={{
               backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
               backgroundSize: '24px 24px'
            }}
         />

         <div className={cn(
            "relative z-10 flex flex-col w-full",
            isChat ? "h-screen overflow-hidden" : "min-h-screen"
         )}>
            <Navbar />
            <main className={cn(
               "flex-1 flex flex-col w-full transition-all duration-300",
               isChat && "min-h-0",
               noPadding ? "p-0" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 md:mb-0"
            )}>
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default MainLayout;
