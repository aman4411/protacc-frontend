// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import Layout from "./components/Layout";
import HomePage from "./pages/Homepage";
import ConsultancyPage from "./pages/Consultancy";
import ContactPage from "./pages/ContactPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import OTPVerification from './components/auth/OTPVerification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/Dashboard';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/GoogleAnalytics';
// import more pages...

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <ScrollToTop />
                    <GoogleAnalytics />
                    <Routes>
                        {/* Admin Routes - Outside Layout to avoid header/footer */}
                        <Route
                            path="admin/*"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Main Site Routes - With Layout (header/footer) */}
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
                            <Route path="forgot-password" element={
                                <RedirectIfAuthenticated>
                                    <ForgotPasswordPage />
                                </RedirectIfAuthenticated>
                            } />
                            <Route path="reset-password" element={<ResetPasswordPage />} />
                            <Route path="verify-email" element={<OTPVerification />} />
                            <Route path="consultancy" element={<ConsultancyPage />} />
                            <Route path="contact" element={<ContactPage />} />
                            <Route path="refund-policy" element={<RefundPolicyPage />} />
                            <Route path="terms-of-service" element={<TermsOfServicePage />} />
                            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="services" element={<ServicesPage />} />
                            <Route path="services/:slug" element={<ServiceDetailPage />} />
                            <Route path="search" element={<SearchPage />} />

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
                        </Route>
                    </Routes>
                    <Toaster position="top-right" />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
