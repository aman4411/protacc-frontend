import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaServicestack, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getDashboardStats } from '../../services/api';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        loading: true
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const data = await getDashboardStats();
            console.log('Dashboard stats received:', data);
            setStats({
                ...data,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: FaUsers,
            color: 'bg-blue-500',
            change: stats.user_growth || '0%',
            changeType: stats.user_growth && stats.user_growth.startsWith('+') ? 'positive' : stats.user_growth && stats.user_growth.startsWith('-') ? 'negative' : 'neutral'
        },
        {
            title: 'Total Orders',
            value: stats.total_orders,
            icon: FaClipboardList,
            color: 'bg-green-500',
            change: stats.order_growth || '0%',
            changeType: stats.order_growth && stats.order_growth.startsWith('+') ? 'positive' : stats.order_growth && stats.order_growth.startsWith('-') ? 'negative' : 'neutral'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats.total_revenue.toLocaleString()}`,
            icon: FaDollarSign,
            color: 'bg-yellow-500',
            change: stats.revenue_growth || '0%',
            changeType: stats.revenue_growth && stats.revenue_growth.startsWith('+') ? 'positive' : stats.revenue_growth && stats.revenue_growth.startsWith('-') ? 'negative' : 'neutral'
        },
        {
            title: 'Pending Orders',
            value: stats.pending_orders,
            icon: FaServicestack,
            color: 'bg-red-500',
            change: '0%', // Pending orders don't need growth calculation
            changeType: 'neutral'
        }
    ];

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'View and manage user accounts',
            link: '/admin/users',
            color: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            title: 'View Orders',
            description: 'Monitor and update order status',
            link: '/admin/orders',
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Service Management',
            description: 'Add, edit, or remove services',
            link: '/admin/services',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'System Settings',
            description: 'Configure application settings',
            link: '/admin/settings',
            color: 'bg-gray-600 hover:bg-gray-700'
        }
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome to your admin dashboard. Here's what's happening with your business today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.loading ? '...' : stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    <Icon className="text-white text-xl" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                {stat.changeType === 'positive' ? (
                                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                                ) : stat.changeType === 'negative' ? (
                                    <FaArrowDown className="text-red-500 text-sm mr-1" />
                                ) : (
                                    <div className="w-3 h-3 mr-1"></div>
                                )}
                                <span className={`text-sm font-medium ${
                                    stat.changeType === 'positive' 
                                        ? 'text-green-600' 
                                        : stat.changeType === 'negative' 
                                        ? 'text-red-600'
                                        : 'text-gray-600'
                                }`}>
                                    {stat.change}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">from last month</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <a
                            key={index}
                            href={action.link}
                            className={`block p-6 rounded-lg text-white transition-colors ${action.color}`}
                        >
                            <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                            <p className="text-sm opacity-90">{action.description}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                    <div className="space-y-4">
                        {stats.loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            </div>
                        ) : stats.recent_users && stats.recent_users.length > 0 ? (
                            <>
                                {stats.recent_users.map((user, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span className="text-sm text-gray-500">{user.email}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                            {user.isEmailVerified ? (
                                                <span className="text-xs text-green-600 mt-1">Verified</span>
                                            ) : (
                                                <span className="text-xs text-orange-600 mt-1">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center pt-2">
                                    <a href="/admin/users" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                                        View all users →
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No users found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {stats.loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            </div>
                        ) : stats.recent_orders && stats.recent_orders.length > 0 ? (
                            <>
                                {stats.recent_orders.map((order, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                #{order.order_number}
                                            </span>
                                            <span className="text-sm text-gray-500">{order.user_name}</span>
                                            <span className="text-xs text-gray-400">
                                                {order.created_at}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-medium text-gray-900">
                                                ₹{order.total_amount.toLocaleString()}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                                order.status === 'payment_received' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'processing'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : order.status === 'pending_payment'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center pt-2">
                                    <a href="/admin/orders" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                                        View all orders →
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No orders found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview; 