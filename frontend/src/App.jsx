import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Housing from './pages/Housing';
import Roommates from './pages/Roommates';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

function App() {
   return (
      <AuthProvider>
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
               </Route>
            </Route>
         </Routes>
      </AuthProvider>
   );
}

export default App;
