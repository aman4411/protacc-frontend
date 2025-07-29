import React, { useState, useEffect } from 'react';
import { 
    FaChartLine, 
    FaUsers, 
    FaShoppingCart, 
    FaDollarSign,
    FaCalendarAlt,
    FaDownload,
    FaSpinner,
    FaArrowUp,
    FaArrowDown,
    FaServicestack
} from 'react-icons/fa';
import { 
    getRevenueAnalytics,
    getOrderAnalytics,
    getUserAnalytics,
    getServiceAnalytics,
    getOverallMetrics,
    getRecentActivity
} from '../../services/api';
import toast from 'react-hot-toast';

const ReportsAnalytics = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('30');
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        revenue: null,
        orders: null,
        users: null,
        services: null,
        metrics: null,
        activity: null
    });

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const revenueData = await getRevenueAnalytics(dateRange);
            const ordersData = await getOrderAnalytics(dateRange);
            const usersData = await getUserAnalytics(dateRange);
            const servicesData = await getServiceAnalytics(dateRange);
            const metricsData = await getOverallMetrics();
            const activityData = await getRecentActivity(dateRange);

            setAnalytics({
                revenue: revenueData,
                orders: ordersData,
                users: usersData,
                services: servicesData,
                metrics: metricsData,
                activity: activityData
            });
        } catch (error) {
            toast.error('Failed to fetch analytics data');
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (value) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    };

    const MetricCard = ({ title, value, growth, icon: Icon, color }) => (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="text-white text-xl" />
                </div>
            </div>
            {growth !== undefined && (
                <div className="mt-4 flex items-center">
                    {growth >= 0 ? (
                        <FaArrowUp className="text-green-500 text-sm mr-1" />
                    ) : (
                        <FaArrowDown className="text-red-500 text-sm mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                        growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {formatPercentage(growth)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last period</span>
                </div>
            )}
        </div>
    );

    const SimpleChart = ({ data, type, height = 200 }) => {
        if (!data || data.length === 0) return <div className="text-center text-gray-500">No data available</div>;
        
        // Handle different data structures from API
        const getValue = (item) => {
            if (type === 'revenue') {
                return item.amount || 0;
            } else if (type === 'orders') {
                return item.orders || 0;
            } else if (type === 'users') {
                return item.count || 0;
            }
            return item.value || item.amount || item.orders || item.count || 0;
        };
        
        const maxValue = Math.max(...data.map(getValue));
        
        return (
            <div className="space-y-2">
                <div className="flex items-end justify-between space-x-1" style={{ height: `${height}px` }}>
                    {data.map((item, index) => {
                        const value = getValue(item);
                        const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        
                        return (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div 
                                    className="bg-indigo-500 rounded-t w-full min-h-[4px] transition-all duration-300 hover:bg-indigo-600"
                                    style={{ height: `${heightPercentage}%` }}
                                    title={`${item.date || item.month}: ${type === 'revenue' ? formatCurrency(value) : value}`}
                                />
                                <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-center">
                                    {item.date ? new Date(item.date).getDate() : item.month}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
                        <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        {/* Date Range Selector */}
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                        </select>
                        
                        {/* Export Button */}
                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            <FaDownload className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'overview', name: 'Overview', icon: FaChartLine },
                        { id: 'revenue', name: 'Revenue', icon: FaDollarSign },
                        { id: 'orders', name: 'Orders', icon: FaShoppingCart },
                        { id: 'users', name: 'Users', icon: FaUsers },
                        { id: 'services', name: 'Services', icon: FaServicestack }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="mr-2" />
                                {tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && analytics.metrics && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Revenue"
                            value={formatCurrency(analytics.metrics.total_revenue)}
                            growth={analytics.metrics.revenue_growth}
                            icon={FaDollarSign}
                            color="bg-green-500"
                        />
                        <MetricCard
                            title="Total Orders"
                            value={analytics.metrics.total_orders}
                            growth={analytics.metrics.order_growth}
                            icon={FaShoppingCart}
                            color="bg-blue-500"
                        />
                        <MetricCard
                            title="Total Users"
                            value={analytics.metrics.total_users}
                            growth={analytics.metrics.user_growth}
                            icon={FaUsers}
                            color="bg-purple-500"
                        />
                        <MetricCard
                            title="Avg Order Value"
                            value={formatCurrency(analytics.metrics.average_order_value)}
                            icon={FaChartLine}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                            <SimpleChart data={analytics.revenue?.daily_revenue} type="revenue" />
                        </div>

                        {/* Orders Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
                            <SimpleChart data={analytics.orders?.daily_orders} type="orders" />
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {analytics.activity?.activities?.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.description}</p>
                                        <p className="text-sm text-gray-500">by {activity.user_name}</p>
                                    </div>
                                    <div className="text-right">
                                        {activity.amount && (
                                            <p className="font-medium text-green-600">{formatCurrency(activity.amount)}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {new Date(activity.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && analytics.revenue && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue</h3>
                            <SimpleChart data={analytics.revenue.daily_revenue} type="revenue" height={300} />
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                            <div className="space-y-4">
                                {analytics.revenue.payment_methods?.length > 0 ? (
                                    analytics.revenue.payment_methods.map((method, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-gray-600">{method.method}</span>
                                            <div className="text-right">
                                                <div className="font-medium">{formatCurrency(method.amount)}</div>
                                                <div className="text-sm text-gray-500">{method.count} transactions</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        No payment method data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && analytics.orders && (
                <div className="space-y-6">
                    {/* Orders Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Orders"
                            value={analytics.orders.total_orders}
                            growth={analytics.orders.order_growth}
                            icon={FaShoppingCart}
                            color="bg-blue-500"
                        />
                        <MetricCard
                            title="Average Order Value"
                            value={formatCurrency(analytics.orders.average_order_value)}
                            icon={FaDollarSign}
                            color="bg-green-500"
                        />
                        <MetricCard
                            title="Completion Rate"
                            value={`${analytics.orders.completion_rate?.toFixed(1)}%`}
                            icon={FaChartLine}
                            color="bg-purple-500"
                        />
                        <MetricCard
                            title="Processing Orders"
                            value={analytics.orders.order_status_breakdown?.find(s => s.status === 'processing')?.count || 0}
                            icon={FaSpinner}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Orders Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily Orders Trend */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Orders Trend</h3>
                            <SimpleChart data={analytics.orders.daily_orders} type="orders" height={300} />
                        </div>
                        
                        {/* Order Status Breakdown */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
                            <div className="space-y-4">
                                {analytics.orders.order_status_breakdown?.map((status, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-3 ${
                                                status.status === 'completed' ? 'bg-green-500' :
                                                status.status === 'processing' ? 'bg-blue-500' :
                                                status.status === 'pending' ? 'bg-yellow-500' :
                                                'bg-gray-500'
                                            }`} />
                                            <span className="text-gray-700 capitalize">{status.status}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{status.count}</div>
                                            <div className="text-sm text-gray-500">{status.percentage?.toFixed(1)}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && analytics.users && (
                <div className="space-y-6">
                    {/* Users Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Users"
                            value={analytics.users.total_users}
                            growth={analytics.users.user_growth}
                            icon={FaUsers}
                            color="bg-purple-500"
                        />
                        <MetricCard
                            title="Verification Rate"
                            value={`${analytics.users.verification_rate?.toFixed(1)}%`}
                            icon={FaChartLine}
                            color="bg-green-500"
                        />
                        <MetricCard
                            title="Admin Users"
                            value={analytics.users.user_role_breakdown?.find(r => r.role === 'admin')?.count || 0}
                            icon={FaUsers}
                            color="bg-red-500"
                        />
                        <MetricCard
                            title="Regular Users"
                            value={analytics.users.user_role_breakdown?.find(r => r.role === 'user')?.count || 0}
                            icon={FaUsers}
                            color="bg-blue-500"
                        />
                    </div>

                    {/* Users Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily Signups */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily User Registrations</h3>
                            <SimpleChart data={analytics.users.daily_signups} type="users" height={300} />
                        </div>
                        
                        {/* User Role Distribution */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Role Distribution</h3>
                            <div className="space-y-4">
                                {analytics.users.user_role_breakdown?.map((role, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-3 ${
                                                role.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                                            }`} />
                                            <span className="text-gray-700 capitalize">{role.role}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{role.count}</div>
                                            <div className="text-sm text-gray-500">{role.percentage?.toFixed(1)}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Verification Rate Progress Bar */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Email Verification Rate</span>
                                    <span>{analytics.users.verification_rate?.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${analytics.users.verification_rate || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && analytics.services && (
                <div className="space-y-6">
                    {/* Services Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Services"
                            value={analytics.services.total_services}
                            icon={FaServicestack}
                            color="bg-indigo-500"
                        />
                        <MetricCard
                            title="Conversion Rate"
                            value={`${analytics.services.service_conversion?.toFixed(1)}%`}
                            icon={FaChartLine}
                            color="bg-green-500"
                        />
                        <MetricCard
                            title="Categories"
                            value={analytics.services.category_performance?.length || 0}
                            icon={FaServicestack}
                            color="bg-purple-500"
                        />
                        <MetricCard
                            title="Top Service Orders"
                            value={analytics.services.popular_services?.[0]?.order_count || 0}
                            icon={FaShoppingCart}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Services Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Popular Services */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Services</h3>
                            <div className="space-y-4">
                                {analytics.services.popular_services?.length > 0 ? (
                                    analytics.services.popular_services.map((service, index) => (
                                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-indigo-600 font-medium text-sm">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{service.service_name}</p>
                                                    <p className="text-sm text-gray-500">{service.order_count} orders</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-green-600">{formatCurrency(service.revenue)}</p>
                                                <p className="text-sm text-gray-500">Revenue</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        No service data available
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Category Performance */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                            <div className="space-y-4">
                                {analytics.services.category_performance?.length > 0 ? (
                                    analytics.services.category_performance.map((category, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-900">{category.category_name}</h4>
                                                <span className="text-sm text-gray-500">{category.service_count} services</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Orders:</span>
                                                    <span className="font-medium ml-2">{category.order_count}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Revenue:</span>
                                                    <span className="font-medium ml-2 text-green-600">
                                                        {formatCurrency(category.revenue)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        No category data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholder for other tabs - this replaces the previous generic placeholder */}
            {!['overview', 'revenue', 'orders', 'users', 'services'].includes(activeTab) && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics
                    </h3>
                    <p className="text-gray-600">This analytics section is not yet implemented.</p>
                </div>
            )}
        </div>
    );
};

export default ReportsAnalytics; 