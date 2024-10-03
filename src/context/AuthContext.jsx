import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ email: null, token: null, isAdmin: null });
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Convert string to boolean

    if (token && email) {
      setUser({ email, token, isAdmin });
    }
  }, []);

  const login = async (credentials) => {
    const response = await axios.post('https://torus-backend-9mrl.onrender.com/api/auth/login', credentials);
    const { token, email, isAdmin } = response.data; 
    setUser({ email, token, isAdmin });
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('isAdmin', isAdmin); 
  };

  const logout = () => {
   
    setUser({ email: null, token: null, isAdmin: null });
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
  };

  const register = async (userData) => {
    await axios.post('https://torus-backend-9mrl.onrender.com/api/auth/register', userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
