import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await api.get('/profile');
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.data.error };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

const register = async (username, email, password, promoCode = null) => {
  try {
    const response = await api.post('/register', { 
      username, 
      email, 
      password,
      promoCode // Add this parameter
    });
    
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        data: response.data,
        appliedBenefits: response.data.appliedBenefits 
      };
    }
    return { success: false, error: response.data.error };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Network error' 
    };
  }
};

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
