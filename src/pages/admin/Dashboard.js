import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import UserManagement from './UserManagement';
import ServiceManagement from './ServiceManagement';
import OrderManagement from './OrderManagement';
import SystemSettings from './SystemSettings';
import DashboardOverview from './DashboardOverview';
import PriorityManagement from './PriorityManagement';
import ReportsAnalytics from './ReportsAnalytics';
import LeadManagement from './LeadManagement';
import ContactManagement from './ContactManagement';
import ReviewManagement from './ReviewManagement';
import CouponManagement from './CouponManagement';
import DeadlineManagement from './DeadlineManagement';
import BlogManagement from './BlogManagement';

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();

    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-header">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/services" element={<ServiceManagement />} />
                <Route path="/priority" element={<PriorityManagement />} />
                <Route path="/settings" element={<SystemSettings />} />
                <Route path="/reports" element={<ReportsAnalytics />} />
                <Route path="/leads" element={<LeadManagement />} />
                <Route path="/contacts" element={<ContactManagement />} />
                <Route path="/reviews" element={<ReviewManagement />} />
                <Route path="/coupons" element={<CouponManagement />} />
                <Route path="/deadlines" element={<DeadlineManagement />} />
                <Route path="/articles" element={<BlogManagement />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminDashboard; 