import React from 'react';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage = () => {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left side - Features/Benefits */}
            <div className="hidden lg:flex lg:flex-1 bg-white border-r border-gray-100 p-12 flex-col justify-center">
                <div className="max-w-md mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Benefits of Joining Us</h2>
                    
                    <div className="space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1 text-gray-900">Professional Tax Planning</h3>
                                <p className="text-gray-600">Strategic tax planning to maximize your savings and compliance</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1 text-gray-900">Financial Documentation</h3>
                                <p className="text-gray-600">Organized and secure management of all your financial records</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-1 text-gray-900">Growth Advisory</h3>
                                <p className="text-gray-600">Expert guidance to help your business reach its full potential</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white rounded-lg shadow-md border border-gray-100">
                        <p className="text-lg font-medium mb-2 text-gray-900">"Their expertise helped us scale our business efficiently!"</p>
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-lg font-bold text-indigo-600">SK</span>
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">Sarah Kim</p>
                                <p className="text-sm text-gray-500">Founder, Growth Ventures</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Signup Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-lg">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
                            Create Your Account
                        </h1>
                        <p className="text-sm text-gray-600">
                            Join us today and take control of your financial future
                        </p>
                    </div>
                    <div className="bg-white py-10 px-8 shadow-2xl rounded-xl">
                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage; 