import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        // If user is authenticated, redirect to homepage
        return <Navigate to="/" replace />;
    }

    // If user is not authenticated, render the children components
    return children;
};

export default RedirectIfAuthenticated; 