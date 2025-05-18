import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'protacc_auth_token';
const USER_KEY = 'protacc_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem(USER_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem(TOKEN_KEY);
    });
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');

    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_KEY);
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }, [token]);

    const login = (authResponse) => {
        setToken(authResponse.token);
        setUser(authResponse.user);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsVerifying(false);
        setVerificationEmail('');
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    const startVerification = (email) => {
        setIsVerifying(true);
        setVerificationEmail(email);
    };

    const completeVerification = () => {
        setIsVerifying(false);
        setVerificationEmail('');
    };

    const value = {
        user,
        token,
        isVerifying,
        verificationEmail,
        login,
        logout,
        startVerification,
        completeVerification,
        isAuthenticated: !!token && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 