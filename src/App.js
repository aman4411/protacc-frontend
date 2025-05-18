// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import Layout from "./components/Layout";
import HomePage from "./pages/Homepage";
import ConsultancyPage from "./pages/Consultancy";
import OTPVerification from './components/auth/OTPVerification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/Dashboard';
// import more pages...

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public Routes */}
                        <Route index element={<HomePage />} />
                        <Route path="signup" element={<SignupPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="verify-email" element={<OTPVerification />} />
                        <Route path="consultancy" element={<ConsultancyPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="admin/*"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
                <Toaster position="top-right" />
            </Router>
        </AuthProvider>
    );
}

export default App;
