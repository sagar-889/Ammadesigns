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
    if (token) {
      try {
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('customerToken');
      }
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
