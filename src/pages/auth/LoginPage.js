import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left side - Features/Benefits */}
            <div className="hidden lg:flex lg:flex-1 bg-white border-r border-gray-100 p-12 flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Why Choose Our Services?</h2>
                    
                    <div className="space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1 text-gray-900">Expert Financial Guidance</h3>
                                <p className="text-gray-600">Get personalized advice from certified professionals with years of experience</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1 text-gray-900">Secure & Confidential</h3>
                                <p className="text-gray-600">Your financial data is protected with enterprise-grade security</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1 text-gray-900">Fast & Efficient</h3>
                                <p className="text-gray-600">Quick response times and streamlined processes save you valuable time</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white rounded-lg shadow-md border border-gray-100">
                        <p className="text-lg font-medium mb-2 text-gray-900">"The most comprehensive accounting service I've ever used!"</p>
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-lg font-bold text-indigo-600">JD</span>
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">John Doe</p>
                                <p className="text-sm text-gray-500">CEO, Tech Innovations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-600 mb-8">
                            Sign in to access your account and manage your financial journey
                        </p>
                    </div>
                    <div className="bg-white py-8 px-8 shadow-2xl rounded-xl space-y-8">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 