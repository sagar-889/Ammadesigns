import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('customerToken');
    console.log('Checking auth, token exists:', !!token);
    
    if (token) {
      try {
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile response:', response.data);
        
        if (response.data) {
          setUser(response.data);
        } else {
          console.log('No user data in response, logging out');
          localStorage.removeItem('customerToken');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error.response?.status, error.message);
        // Only remove token if it's actually invalid (401/403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Token invalid, logging out');
          localStorage.removeItem('customerToken');
          setUser(null);
        } else {
          console.log('Network or other error, keeping token');
        }
        // For network errors or other issues, keep the token and try again later
      }
    } else {
      console.log('No token found');
    }
    setLoading(false);
  };

  const login = async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('customerToken', response.data.token);
    
    // Handle admin login
    if (response.data.isAdmin) {
      localStorage.setItem('token', response.data.token); // Also set admin token
      setUser(response.data.user);
    } else {
      setUser(response.data.customer);
    }
    
    return response.data;
  };

  const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    localStorage.setItem('customerToken', response.data.token);
    setUser(response.data.customer);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const token = localStorage.getItem('customerToken');
    await api.put('/auth/profile', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
