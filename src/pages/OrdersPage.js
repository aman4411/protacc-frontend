import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaClipboardList } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getOrders } from '../services/api';

const OrderStatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status) {
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">Browse our services and place your first order</p>
                        <Link
                            to="/services"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                        >
                            Browse Services
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
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
                                        Service
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
                                            <div className="text-sm text-gray-900">{order.service.name}</div>
                                            <div className="text-sm text-gray-500">{order.service.short_description}</div>
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