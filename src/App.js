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
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/Dashboard';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
// import more pages...

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public Routes */}
                        <Route index element={<HomePage />} />
                        <Route path="signup" element={
                            <RedirectIfAuthenticated>
                                <SignupPage />
                            </RedirectIfAuthenticated>
                        } />
                        <Route path="login" element={
                            <RedirectIfAuthenticated>
                                <LoginPage />
                            </RedirectIfAuthenticated>
                        } />
                        <Route path="verify-email" element={<OTPVerification />} />
                        <Route path="consultancy" element={<ConsultancyPage />} />
                        <Route path="services" element={<ServicesPage />} />
                        <Route path="services/:slug" element={<ServiceDetailPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="cart"
                            element={
                                <ProtectedRoute>
                                    <CartPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="orders"
                            element={
                                <ProtectedRoute>
                                    <OrdersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="orders/:orderNumber"
                            element={
                                <ProtectedRoute>
                                    <OrderDetailPage />
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
