import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      try {
         const userInfo = localStorage.getItem('userInfo');
         if (userInfo) {
            const parsed = JSON.parse(userInfo);
            setUser(parsed);
         }
      } catch (error) {
         console.error('Failed to parse user info:', error);
         localStorage.removeItem('userInfo');
      }
      setLoading(false);
   }, []);

   const login = async (email, password) => {
      try {
         const { data } = await api.post('/users/login', { email, password });
         localStorage.setItem('userInfo', JSON.stringify(data));
         setUser(data);
         toast.success('Welcome back!');
         return data;
      } catch (error) {
         const message = error.response?.data?.message || error.message || 'Login failed';
         toast.error(message);
         throw error;
      }
   };

   const register = async (userData) => {
      try {
         const { data } = await api.post('/users', userData);
         localStorage.setItem('userInfo', JSON.stringify(data));
         setUser(data);
         toast.success('Account created successfully!');
         return data;
      } catch (error) {
         const message = error.response?.data?.message || error.message || 'Registration failed';
         toast.error(message);
         throw error;
      }
   };

   const logout = () => {
      localStorage.removeItem('userInfo');
      setUser(null);
      toast.success('Logged out successfully');
   };

   const updateUser = (data) => {
      try {
         const updated = { ...user, ...data };
         localStorage.setItem('userInfo', JSON.stringify(updated));
         setUser(updated);
      } catch (error) {
         console.error('Failed to update user:', error);
         toast.error('Failed to update user data');
      }
   }

   return (
      <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
         {children}
      </AuthContext.Provider>
   );
};
