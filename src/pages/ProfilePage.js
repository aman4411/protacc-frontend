import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-indigo-600 px-6 py-8">
                        <div className="flex items-center">
                            <div className="h-20 w-20 rounded-full bg-indigo-300 flex items-center justify-center text-2xl font-bold text-white">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </div>
                            <div className="ml-6">
                                <h1 className="text-2xl font-bold text-white">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <p className="text-indigo-200 mt-1">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-6 py-6">
                        {/* Email Verification Status */}
                        {!user?.isEmailVerified && (
                            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            Your email is not verified. 
                                            <Link to="/verify-email" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                                                Verify now
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Profile Details */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                                <div className="mt-4 border rounded-md p-4 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">First Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{user?.firstName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Last Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{user?.lastName}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Phone</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Role</label>
                                        <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Member Since</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(user?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Settings Section */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                                <div className="mt-4 border rounded-md p-4">
                                    <div className="space-y-4">
                                        <button className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Change Password
                                        </button>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="ml-0 sm:ml-3 mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 