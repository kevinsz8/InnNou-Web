import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, refreshToken: string) => Promise<void>;
    logout: () => void;
    token: string | null;
    loading: boolean;
    updateSession: (token: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Restore token and auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setIsAuthenticated(true);
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (tokenValue?: string, refreshToken?: string) => {
        setIsAuthenticated(true);
        setToken(tokenValue ?? null);

        if (tokenValue) localStorage.setItem('authToken', tokenValue);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        navigate('/dashboard');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);

        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken'); 

        navigate('/');
    };

    const updateSession = (tokenValue: string, refreshTokenValue: string) => {
        setIsAuthenticated(true);
        setToken(tokenValue);

        localStorage.setItem("authToken", tokenValue);
        localStorage.setItem("refreshToken", refreshTokenValue);
    };

    const value = { isAuthenticated, login, logout, token, loading, updateSession };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};

