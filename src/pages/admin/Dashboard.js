import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import UserManagement from './UserManagement';
import ServiceManagement from './ServiceManagement';
import DashboardOverview from './DashboardOverview';

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();

    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                    <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/orders" element={<div className="p-6"><h2 className="text-2xl font-bold">Order Management</h2><p className="text-gray-600">Coming soon...</p></div>} />
                <Route path="/services" element={<ServiceManagement />} />
                <Route path="/settings" element={<div className="p-6"><h2 className="text-2xl font-bold">System Settings</h2><p className="text-gray-600">Coming soon...</p></div>} />
                <Route path="/reports" element={<div className="p-6"><h2 className="text-2xl font-bold">Reports & Analytics</h2><p className="text-gray-600">Coming soon...</p></div>} />
                <Route path="/notifications" element={<div className="p-6"><h2 className="text-2xl font-bold">Notifications</h2><p className="text-gray-600">Coming soon...</p></div>} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminDashboard; 