import axios from 'axios';

const api = axios.create({
   baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
   const user = JSON.parse(localStorage.getItem('userInfo'));
   if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
   }
   return config;
});

// Add response interceptor for global error handling
api.interceptors.response.use(
   (response) => response,
   (error) => {
      // Handle network errors
      if (!error.response) {
         console.error('Network error:', error);
         error.message = 'Network error. Please check your connection.';
      }
      return Promise.reject(error);
   }
);

export default api;
