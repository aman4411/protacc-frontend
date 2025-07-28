import React, { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaServicestack, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getUsers, getAdminOrders } from '../../services/api';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        loading: true
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const [usersResponse, ordersResponse] = await Promise.all([
                getUsers({ limit: 1 }),
                getAdminOrders({ limit: 1 })
            ]);

            // Get total counts from pagination
            const totalUsers = usersResponse.pagination?.total || 0;
            
            // For orders, we'll need to get all orders to calculate stats
            const allOrdersResponse = await getAdminOrders({ limit: 100 });
            const orders = allOrdersResponse || [];
            
            const totalOrders = Array.isArray(orders) ? orders.length : 0;
            const pendingOrders = Array.isArray(orders) ? orders.filter(order => 
                order.status === 'pending_payment' || order.status === 'processing'
            ).length : 0;
            
            const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => 
                sum + (order.totalAmount || 0), 0
            ) : 0;

            setStats({
                totalUsers,
                totalOrders,
                totalRevenue,
                pendingOrders,
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
            value: stats.totalUsers,
            icon: FaUsers,
            color: 'bg-blue-500',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: FaClipboardList,
            color: 'bg-green-500',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: FaDollarSign,
            color: 'bg-yellow-500',
            change: '+15%',
            changeType: 'positive'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: FaServicestack,
            color: 'bg-red-500',
            change: '-5%',
            changeType: 'negative'
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
                                ) : (
                                    <FaArrowDown className="text-red-500 text-sm mr-1" />
                                )}
                                <span className={`text-sm font-medium ${
                                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>User activity will be displayed here</p>
                                <a href="/admin/users" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    View all users →
                                </a>
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
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>Recent orders will be displayed here</p>
                                <a href="/admin/orders" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    View all orders →
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview; 