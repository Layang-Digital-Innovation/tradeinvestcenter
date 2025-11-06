import axios from 'axios';
import authService from '@/services/auth.service';
import { toast } from 'react-toastify';

// Buat instance axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Tambahkan interceptor untuk request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor untuk response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Cek apakah error adalah 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Jika pesan error adalah "jwt expired", logout user dan redirect ke login
      if (error.response.data && 
          (error.response.data.message === 'jwt expired' || 
           error.response.data.message === 'Unauthorized' ||
           error.response.data === 'jwt expired')) {
        
        // Tampilkan pesan error
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
          position: 'top-center',
          autoClose: 5000,
        });
        
        // Logout user
        authService.logout();
        
        // Redirect ke halaman login
        if (typeof window !== 'undefined') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Konfigurasi global axios
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Konfigurasi global axios response
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Cek apakah error adalah 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Jika pesan error adalah "jwt expired", logout user dan redirect ke login
      if (error.response.data && 
          (error.response.data.message === 'jwt expired' || 
           error.response.data.message === 'Unauthorized' ||
           error.response.data === 'jwt expired')) {
        
        // Tampilkan pesan error
        if (typeof window !== 'undefined') {
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
            position: 'top-center',
            autoClose: 5000,
          });
          
          // Logout user
          authService.logout();
          
          // Redirect ke halaman login
          window.location.href = '/login?expired=true';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;