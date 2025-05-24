import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaArrowLeft, FaClock, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getOrderByNumber, getOrderStatusHistory } from '../services/api';

const OrderStatusBadge = ({ status }) => {
    const getStatusColor = (orderStatus) => {
        switch (orderStatus) {
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'payment_received':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'documents_required':
                return 'bg-orange-100 text-orange-800';
            case 'documents_received':
                return 'bg-purple-100 text-purple-800';
            case 'in_progress':
                return 'bg-indigo-100 text-indigo-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (orderStatus) => {
        return orderStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {formatStatus(status)}
        </span>
    );
};

const OrderDetailPage = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const [orderData, historyData] = await Promise.all([
                    getOrderByNumber(orderNumber),
                    getOrderStatusHistory(orderNumber)
                ]);
                setOrder(orderData);
                setStatusHistory(historyData);
            } catch (error) {
                toast.error('Failed to load order details');
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderNumber, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Order not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FaArrowLeft className="text-xl" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                        Order #{order.order_number}
                                    </h2>
                                    <p className="text-gray-600">
                                        Placed on {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-indigo-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">{order.service.name}</p>
                                            <p className="text-gray-600">{order.service.short_description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaClock className="text-indigo-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Estimated Delivery</p>
                                            <p className="text-gray-600">{order.service.estimated_delivery_days} days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status History */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
                            <div className="space-y-8">
                                {statusHistory.map((history, index) => (
                                    <div key={history.id} className="relative">
                                        {index !== statusHistory.length - 1 && (
                                            <div className="absolute top-8 left-4 bottom-0 w-0.5 bg-gray-200" />
                                        )}
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                            </div>
                                            <div>
                                                <OrderStatusBadge status={history.status} />
                                                <p className="text-sm text-gray-600 mt-2">
                                                    {history.notes}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(history.created_at).toLocaleString()} by {history.user.first_name} {history.user.last_name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="text-gray-900 font-medium">₹{order.total_amount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Booking Amount</span>
                                    <span className="text-green-600 font-medium">₹{order.booking_amount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Remaining Amount</span>
                                    <span className="text-gray-900 font-medium">₹{order.remaining_amount}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`font-medium ${order.payment_status ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {order.payment_status ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!order.payment_status && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 text-yellow-600 mb-4">
                                    <FaMoneyBillWave className="text-xl" />
                                    <h3 className="text-lg font-semibold">Payment Required</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Please complete the payment to proceed with your order.
                                </p>
                                <button
                                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Pay Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage; 