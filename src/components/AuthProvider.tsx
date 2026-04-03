
//import React, { useState } from 'react';
//import type { ReactNode } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { AuthContext } from './authContext';

//export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//  const [isAuthenticated, setIsAuthenticated] = useState(false);
//  const [token, setToken] = useState<string | null>(null);
//  const navigate = useNavigate();

//    const login = async (tokenValue?: string) => {
//        setIsAuthenticated(true);
//        setToken(tokenValue ?? null);
//        if (tokenValue) localStorage.setItem('authToken', tokenValue);
//        navigate('/dashboard');
//    };

//    const logout = () => {
//        setIsAuthenticated(false);
//        setToken(null);
//        localStorage.removeItem('authToken');
//        navigate('/');
//    };

//  const value = { isAuthenticated, login, logout, token };

//  return (
//    <AuthContext.Provider value={value}>
//      {children}
//    </AuthContext.Provider>
//  );
//};
