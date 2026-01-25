import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { cn } from "@/lib/utils";

const MainLayout = () => {
   const location = useLocation();
   const isDashboard = location.pathname === '/';

   return (
      <div className="min-h-screen bg-slate-50 relative">
         {/* PREMIUM BACKGROUND TEXTURE */}
         <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]"
            style={{
               backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
               backgroundSize: '24px 24px'
            }}
         />

         <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className={cn(
               "flex-1 transition-all duration-300 w-full",
               isDashboard ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 md:mb-0"
            )}>
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default MainLayout;
