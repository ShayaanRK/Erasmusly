import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Housing from './pages/Housing';
import Roommates from './pages/Roommates';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Events from './pages/Events';

function App() {
   return (
      <AuthProvider>
         <Toaster
            position="top-right"
            toastOptions={{
               duration: 4000,
               style: {
                  background: '#fff',
                  color: '#0f172a',
                  padding: '16px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  fontWeight: '600',
               },
               success: {
                  iconTheme: {
                     primary: 'hsl(var(--primary))',
                     secondary: '#fff',
                  },
               },
               error: {
                  iconTheme: {
                     primary: '#ef4444',
                     secondary: '#fff',
                  },
               },
            }}
         />
         <div className="h-full w-full">
            <Routes>
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />

               <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                     <Route path="/" element={<Dashboard />} />
                     <Route path="/housing" element={<Housing />} />
                     <Route path="/roommates" element={<Roommates />} />
                     <Route path="/chat" element={<Chat />} />
                     <Route path="/profile" element={<Profile />} />
                     <Route path="/events" element={<Events />} />
                  </Route>
               </Route>
            </Routes>
         </div>
      </AuthProvider>
   );
}

export default App;
