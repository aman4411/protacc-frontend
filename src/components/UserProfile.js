import React, { useState, useEffect } from 'react';
import {
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaShoppingCart,
    FaEye,
    FaSpinner,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaClock,
    FaUserShield
} from 'react-icons/fa';
import { getUserOrders, getOrderByNumber } from '../services/api';
import toast from 'react-hot-toast';

const UserProfile = ({ user, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUserOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching orders for user ID:', user.id);
            const ordersData = await getUserOrders(user.id);
            console.log('Orders data received:', ordersData);
            setOrders(ordersData.orders || []);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            toast.error('Failed to fetch user orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrderDetails = async (orderNumber) => {
        try {
            console.log('Clicked View Details for order:', orderNumber);
            setOrderDetailsLoading(true);
            setShowOrderDetails(true);
            console.log('About to fetch order details...');
            const orderDetails = await getOrderByNumber(orderNumber);
            console.log('Order details received:', orderDetails);
            setSelectedOrder(orderDetails);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Failed to fetch order details');
            setShowOrderDetails(false);
        } finally {
            setOrderDetailsLoading(false);
        }
    };

    const closeOrderDetails = () => {
        setShowOrderDetails(false);
        setSelectedOrder(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            case 'processing':
                return <FaClock className="text-blue-500" />;
            case 'pending':
                return <FaExclamationTriangle className="text-yellow-500" />;
            default:
                return <FaClock className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user) return null;

    return (
        <>
            {/* User Profile Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-6 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
                                <FaUser className="text-2xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.first_name} {user.last_name}</h2>
                                <p className="text-indigo-200">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-indigo-200 transition-colors"
                        >
                            <FaTimes className="text-2xl" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {/* User Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaUser className="text-gray-400 mr-3" />
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-medium">{user.first_name} {user.last_name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-400 mr-3" />
                                        <span className="text-gray-600">Email:</span>
                                        <span className="ml-2 font-medium">{user.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaPhone className="text-gray-400 mr-3" />
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="ml-2 font-medium">{user.phone && user.phone.trim() !== '' ? user.phone : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaUserShield className="text-gray-400 mr-3" />
                                        <span className="text-gray-600">Role:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="text-gray-400 mr-3" />
                                        <span className="text-gray-600">Joined:</span>
                                        <span className="ml-2 font-medium">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCheckCircle className={user.email_verified ? 'text-green-500' : 'text-gray-400'} />
                                        <span className="ml-3 text-gray-600">Email Status:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                            user.email_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.email_verified ? 'Verified' : 'Not Verified'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Statistics */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Orders:</span>
                                        <span className="font-semibold text-lg">{orders.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Spent:</span>
                                        <span className="font-semibold text-lg text-green-600">
                                            {formatCurrency(
                                                orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Completed Orders:</span>
                                        <span className="font-semibold text-lg">
                                            {orders.filter(order => order.status === 'completed').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Average Order Value:</span>
                                        <span className="font-semibold text-lg">
                                            {orders.length > 0 
                                                ? formatCurrency(
                                                    orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / orders.length
                                                )
                                                : formatCurrency(0)
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <FaShoppingCart className="mr-2" />
                                    Order History ({orders.length})
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No orders found for this user
                                    </div>
                                ) : (
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Order Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
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
                                                    Payment
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-indigo-600">
                                                            {order.order_number}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {order.items?.length || 0} service(s)
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(order.total_amount)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Booking: {formatCurrency(order.booking_amount)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {getStatusIcon(order.status)}
                                                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                                {order.status?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            order.payment_status 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {order.payment_status ? 'PAID' : 'PENDING'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleViewOrderDetails(order.order_number)}
                                                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                        >
                                                            <FaEye className="mr-1" />
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Order Details Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Order Details: {selectedOrder?.order_number}
                            </h3>
                            <button
                                onClick={closeOrderDetails}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Order Details Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                            {orderDetailsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                                </div>
                            ) : selectedOrder ? (
                                <div className="space-y-6">
                                    {/* Order Summary */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-600">Order Number:</span>
                                                <span className="ml-2 font-medium">{selectedOrder.order_number}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Date:</span>
                                                <span className="ml-2 font-medium">
                                                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                                    {selectedOrder.status?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Payment:</span>
                                                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                                    selectedOrder.payment_status 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {selectedOrder.payment_status ? 'PAID' : 'PENDING'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Services Ordered</h4>
                                        <div className="space-y-4">
                                            {selectedOrder.items?.map((item, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="font-medium text-gray-900">{item.service?.name}</h5>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {item.service?.short_description}
                                                            </p>
                                                            <div className="mt-2 text-sm text-gray-500">
                                                                Quantity: {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium text-gray-900">
                                                                {formatCurrency(item.price)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Booking: {formatCurrency(item.booking_amount)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Totals */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Booking Amount:</span>
                                                <span className="font-medium">{formatCurrency(selectedOrder.booking_amount)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Remaining Amount:</span>
                                                <span className="font-medium">{formatCurrency(selectedOrder.remaining_amount)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                                <span>Total Amount:</span>
                                                <span className="text-indigo-600">{formatCurrency(selectedOrder.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {selectedOrder.notes && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-700">{selectedOrder.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Failed to load order details
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile; 