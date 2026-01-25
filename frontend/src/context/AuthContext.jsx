import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
         setUser(userInfo);
      }
      setLoading(false);
   }, []);

   const login = async (email, password) => {
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
   };

   const register = async (userData) => {
      const { data } = await api.post('/users', userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
   };

   const logout = () => {
      localStorage.removeItem('userInfo');
      setUser(null);
   };

   const updateUser = (data) => {
      const updated = { ...user, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updated));
      setUser(updated);
   }

   return (
      <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
         {children}
      </AuthContext.Provider>
   );
};
