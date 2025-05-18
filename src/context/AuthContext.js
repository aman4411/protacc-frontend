import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');

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
        setUser,
        isVerifying,
        verificationEmail,
        startVerification,
        completeVerification,
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