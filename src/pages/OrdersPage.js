import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle, FaSyncAlt, FaShoppingBag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderStatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_booking_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'booking_amount_received':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'documents_required':
                return 'bg-orange-100 text-orange-800';
            case 'documents_received':
                return 'bg-indigo-100 text-indigo-800';
            case 'in_progress':
                return 'bg-cyan-100 text-cyan-800';
            case 'pending_final_payment':
                return 'bg-amber-100 text-amber-800';
            case 'full_payment_received':
                return 'bg-emerald-100 text-emerald-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            // Legacy status support
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'payment_received':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {formatStatus(status)}
        </span>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setError(null);
            setLoading(true);
            console.log('Fetching orders...');
            console.log('User from context:', user);
            console.log('Token from context:', token ? 'Present' : 'Missing');
            
            // Check if user is authenticated using AuthContext
            if (!user || !token) {
                throw new Error('No authentication found. Please log in again.');
            }
            
            // Double-check localStorage token (in case of mismatch)
            const storedToken = localStorage.getItem('protacc_auth_token');
            console.log('Token found in localStorage:', storedToken ? 'Yes' : 'No');
            console.log('Token length:', storedToken ? storedToken.length : 0);
            
            if (!storedToken) {
                throw new Error('No authentication token found. Please log in again.');
            }
            
            console.log('Making API call to get orders...');
            const data = await getOrders();
            console.log('Orders fetched successfully:', data);
            
            // Ensure data is always an array
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load orders:', error);
            console.error('Error type:', typeof error);
            console.error('Error message:', error.message);
            console.error('Full error object:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to load orders. Please try again.';
            
            if (error.message?.includes('No authentication')) {
                errorMessage = 'Please log in to view your orders.';
            } else if (error.message?.includes('Invalid or expired token')) {
                errorMessage = 'Your session has expired. Please log in again.';
            } else if (error.message?.includes('Authorization header is required')) {
                errorMessage = 'Authentication required. Please log in again.';
            } else if (error.message?.includes('Network Error')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            setOrders([]); // Ensure orders is always an array
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRetry = () => {
        fetchOrders();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-header-safe">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-header-safe pb-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-20">
                        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Something went wrong</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            <FaSyncAlt />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-header-safe pb-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-20">
                        <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">No orders found</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate('/services')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-colors"
                        >
                            Explore Services
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-header-safe pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Services
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.items && order.items.length > 0 ? (
                                                <div className="space-y-1">
                                                    {order.items.length === 1 ? (
                                                        <>
                                                            <div className="text-sm text-gray-900">{order.items[0].service?.name || 'Unknown Service'}</div>
                                                            <div className="text-sm text-gray-500">{order.items[0].service?.short_description || ''}</div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="text-sm text-gray-900 font-medium">
                                                                {order.items.length} Services
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {order.items.slice(0, 2).map(item => item.service?.name || 'Unknown').join(', ')}
                                                                {order.items.length > 2 && ` +${order.items.length - 2} more`}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">No services found</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">₹{order.total_amount}</div>
                                            <div className="text-xs text-gray-500">
                                                Paid: ₹{order.booking_amount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                to={`/orders/${order.order_number}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage; 