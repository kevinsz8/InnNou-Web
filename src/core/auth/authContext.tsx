import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../../utils/jwt';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, refreshToken: string) => Promise<void>;
    logout: () => void;
    token: string | null;
    loading: boolean;
    updateSession: (token: string, refreshToken: string) => void;
    isImpersonating: boolean;
    impersonatedUserToken: string | null;
    impersonatedEmail: string | null;
    actorEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [impersonatedUserToken, setImpersonatedUserToken] = useState<string | null>(null);
    const [impersonatedEmail, setImpersonatedEmail] = useState<string | null>(null);
    const [actorEmail, setActorEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    const analyzeToken = (tokenValue: string) => {
        const decoded = decodeToken(tokenValue);

        if (!decoded) return;

        if (decoded.impersonatedUserToken) {
            setIsImpersonating(true);
            setImpersonatedUserToken(decoded.impersonatedUserToken);
            setImpersonatedEmail(decoded.impersonatedEmail || null); 
            setActorEmail(decoded.email || null);
        } else {
            setIsImpersonating(false);
            setImpersonatedUserToken(null);
            setImpersonatedEmail(null);
            setActorEmail(null);
        }
    };

    // Restore token and auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setIsAuthenticated(true);
            setToken(storedToken);
            analyzeToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (tokenValue?: string, refreshToken?: string) => {
        setIsAuthenticated(true);
        setToken(tokenValue ?? null);

        if (tokenValue) {
            localStorage.setItem('authToken', tokenValue);
            analyzeToken(tokenValue);
        }
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

        analyzeToken(tokenValue);
    };

    const value = {
        isAuthenticated,
        login,
        logout,
        token,
        loading,
        updateSession,
        isImpersonating,
        impersonatedUserToken,
        impersonatedEmail,
        actorEmail
    };

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

