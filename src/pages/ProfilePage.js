import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaCalendarAlt, 
    FaShoppingCart, 
    FaCreditCard, 
    FaEye, 
    FaEdit,
    FaCheckCircle,
    FaExclamationTriangle,
    FaArrowRight,
    FaFileInvoiceDollar,
    FaClock
} from 'react-icons/fa';
import { getOrders } from '../services/api';

const ProfilePage = () => {
    const { user } = useAuth();
    const [recentOrders, setRecentOrders] = useState([]);
    const [orderStats, setOrderStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        try {
            console.log('ProfilePage: Fetching orders...');
            
            // Check authentication
            const token = localStorage.getItem('protacc_auth_token');
            if (!token) {
                console.error('ProfilePage: No authentication token found');
                setLoading(false);
                return;
            }
            
            console.log('ProfilePage: Making API call to get orders...');
            
            // Get all orders (API doesn't support pagination parameters)
            const allOrders = await getOrders();
            console.log('ProfilePage: Orders fetched successfully:', allOrders);
            
            // Ensure we have an array
            const ordersArray = Array.isArray(allOrders) ? allOrders : [];
            
            // Get recent orders (last 3)
            const recentOrders = ordersArray.slice(0, 3);
            setRecentOrders(recentOrders);
            
            // Calculate stats from all orders
            const stats = {
                total: ordersArray.length,
                completed: ordersArray.filter(order => order.status === 'completed').length,
                pending: ordersArray.filter(order => order.status === 'pending' || order.status === 'pending_payment').length,
            };
            
            console.log('ProfilePage: Calculated stats:', stats);
            setOrderStats(stats);
        } catch (error) {
            console.error('ProfilePage: Error fetching orders:', error);
            // Don't show error to user on profile page, just log it
            setRecentOrders([]);
            setOrderStats({ total: 0, completed: 0, pending: 0 });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
            pending_payment: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
            payment_received: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
            processing: { color: 'bg-blue-100 text-blue-800', icon: FaCreditCard },
            documents_required: { color: 'bg-orange-100 text-orange-800', icon: FaExclamationTriangle },
            documents_received: { color: 'bg-purple-100 text-purple-800', icon: FaCheckCircle },
            in_progress: { color: 'bg-indigo-100 text-indigo-800', icon: FaClock },
            completed: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
            cancelled: { color: 'bg-red-100 text-red-800', icon: FaExclamationTriangle },
            paid: { color: 'bg-blue-100 text-blue-800', icon: FaCreditCard }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        const IconComponent = config.icon;
        
        // Format status text
        const formatStatus = (status) => {
            return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="mr-1" />
                {formatStatus(status)}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-header-safe pb-12">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="h-24 w-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                                    {user?.isEmailVerified ? (
                                        <FaCheckCircle className="text-white text-sm" />
                                    ) : (
                                        <FaExclamationTriangle className="text-white text-sm" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Welcome, {user?.firstName}!
                                </h1>
                                <p className="text-indigo-100 text-lg">
                                    Manage your profile and track your orders
                                </p>
                                {!user?.isEmailVerified && (
                                    <div className="mt-3 inline-flex items-center text-yellow-200">
                                        <FaExclamationTriangle className="mr-2" />
                                        <span className="text-sm">Email verification required</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="hidden lg:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="text-center">
                                    {loading ? (
                                        <div className="w-12 h-8 bg-white/20 rounded mx-auto animate-pulse"></div>
                                    ) : (
                                        <div className="text-3xl font-bold text-white">{orderStats.total}</div>
                                    )}
                                    <div className="text-indigo-200 text-sm">Total Orders</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Email Verification Alert */}
                {!user?.isEmailVerified && (
                    <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-xl p-6 shadow-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-medium text-yellow-800">Email Verification Required</h3>
                                <p className="text-yellow-700 mt-1">
                                    Please verify your email to access all features and receive important updates.
                                </p>
                            </div>
                            <div className="ml-4">
                                <Link 
                                    to="/verify-email" 
                                    className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                >
                                    Verify Email
                                    <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                {loading ? (
                                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{orderStats.total}</p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaShoppingCart className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                {loading ? (
                                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{orderStats.completed}</p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaCheckCircle className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                {loading ? (
                                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{orderStats.pending}</p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FaClock className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <FaUser className="mr-3" />
                                    Profile Information
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
                                                <FaUser className="mr-2" />
                                                First Name
                                            </label>
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                                                {user?.firstName}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
                                                <FaEnvelope className="mr-2" />
                                                Email Address
                                            </label>
                                            <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                                                <span className="text-lg text-gray-900 flex-1">{user?.email}</span>
                                                {user?.isEmailVerified ? (
                                                    <FaCheckCircle className="text-green-500 ml-2" />
                                                ) : (
                                                    <FaExclamationTriangle className="text-yellow-500 ml-2" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
                                                <FaUser className="mr-2" />
                                                Last Name
                                            </label>
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                                                {user?.lastName}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
                                                <FaPhone className="mr-2" />
                                                Phone Number
                                            </label>
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                                                {user?.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
                                        <FaCalendarAlt className="mr-2" />
                                        Member Since
                                    </label>
                                    <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                                        {new Date(user?.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <button className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        <FaEdit className="mr-2" />
                                        Edit Profile
                                    </button>
                                    <button className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        <FaCreditCard className="mr-2" />
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white flex items-center">
                                        <FaFileInvoiceDollar className="mr-3" />
                                        Recent Orders
                                    </h2>
                                    <Link 
                                        to="/orders" 
                                        className="text-green-100 hover:text-white transition-colors"
                                    >
                                        <FaArrowRight />
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                        <p className="text-gray-500 mt-2">Loading orders...</p>
                                    </div>
                                ) : recentOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        #{order.order_number}
                                                    </span>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-indigo-600">
                                                        {formatCurrency(order.total_amount)}
                                                    </span>
                                                    <Link 
                                                        to={`/orders/${order.order_number}`}
                                                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                        
                                        <Link 
                                            to="/orders"
                                            className="block w-full text-center py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 font-medium"
                                        >
                                            View All Orders
                                            <FaArrowRight className="inline ml-2" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">No orders yet</h3>
                                        <p className="text-sm text-gray-500 mb-4">Start exploring our services</p>
                                        <Link 
                                            to="/services"
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                                        >
                                            Browse Services
                                            <FaArrowRight className="ml-2" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Dashboard Link (if admin) */}
                        {user?.role === 'admin' && (
                            <div className="mt-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-bold mb-2">Admin Access</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Access administrative features and dashboard
                                </p>
                                <Link
                                    to="/admin"
                                    className="inline-flex items-center px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                >
                                    Admin Dashboard
                                    <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 