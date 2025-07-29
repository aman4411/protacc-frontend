import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaUsers, 
    FaShoppingCart, 
    FaCog, 
    FaChartBar, 
    FaBars, 
    FaTimes,
    FaTasks,
    FaServicestack,
    FaClipboardList,
    FaUserShield,
    FaSortNumericDown,
    FaHome,
    FaBox,
    FaSignOutAlt,
    FaChartLine,
    FaHandshake
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: FaHome },
        { name: 'User Management', path: '/admin/users', icon: FaUsers },
        { name: 'Service Management', path: '/admin/services', icon: FaBox },
        { name: 'Order Management', path: '/admin/orders', icon: FaShoppingCart },
        { name: 'Lead Management', path: '/admin/leads', icon: FaHandshake },
        { name: 'Priority Management', path: '/admin/priority', icon: FaSortNumericDown },
        { name: 'Reports & Analytics', path: '/admin/reports', icon: FaChartLine },
        { name: 'System Settings', path: '/admin/settings', icon: FaCog }
    ];

    const isActiveRoute = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
                
                {/* Logo */}
                <div className="text-white flex items-center space-x-2 px-4">
                    <FaUserShield className="text-2xl" />
                    <span className="text-2xl font-extrabold">Admin Panel</span>
                </div>

                {/* Admin Info */}
                <div className="px-4 py-3 bg-indigo-900 rounded-lg mx-2">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-sm font-medium">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-indigo-300">{user?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActiveRoute(item);
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-indigo-900 text-white border-r-4 border-indigo-400'
                                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className="text-lg" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-lg">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
                            >
                                {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">
                                {menuItems.find(item => isActiveRoute(item))?.name || 'Admin Dashboard'}
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/" 
                                className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Back to Website
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default AdminLayout; 