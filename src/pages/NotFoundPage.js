import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import Seo from '../components/Seo';

const NotFoundPage = () => (
    <div className="min-h-screen bg-gray-50 pt-header flex items-center justify-center px-4 py-20">
        <Seo
            title="Page not found | Protacc"
            description="The page you are looking for doesn't exist or may have moved."
            path="/404"
            noindex
        />
        <div className="text-center max-w-md">
            <FaExclamationTriangle className="mx-auto text-5xl text-indigo-400 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">404 — Page not found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or may have moved.</p>
            <div className="flex flex-wrap justify-center gap-3">
                <Link to="/" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Go home
                </Link>
                <Link to="/services" className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all">
                    Browse services
                </Link>
            </div>
        </div>
    </div>
);

export default NotFoundPage;
