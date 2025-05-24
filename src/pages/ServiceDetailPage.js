import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSpinner, FaClock, FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getServiceBySlug, addToCart } from '../services/api';

const ServiceDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceBySlug(slug);
                setService(data);
            } catch (error) {
                toast.error('Failed to load service details');
                navigate('/services');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [slug, navigate]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add services to cart');
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart(service.id);
            toast.success('Service added to cart');
        } catch (error) {
            toast.error('Failed to add service to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Service not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                                <p className="text-gray-600">{service.short_description}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-sm text-gray-500">Total Price</p>
                                <p className="text-3xl font-bold text-indigo-600">₹{service.price}</p>
                                <p className="text-sm text-gray-500">
                                    (₹{service.booking_amount} booking amount)
                                </p>
                            </div>
                        </div>

                        {/* Service Information */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Description</h2>
                                <p className="text-gray-600 whitespace-pre-line">{service.description}</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FaClock className="text-indigo-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Estimated Delivery</p>
                                            <p className="text-gray-600">{service.estimated_delivery_days} days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-indigo-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Category</p>
                                            <p className="text-gray-600">{service.category?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features and Requirements */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {service.features && service.features.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <FaCheckCircle className="text-green-500 mt-1" />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {service.requirements && service.requirements.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                                    <ul className="space-y-2">
                                        {service.requirements.map((requirement, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <FaFileAlt className="text-indigo-600 mt-1" />
                                                <span className="text-gray-600">{requirement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <button
                                onClick={() => navigate('/services')}
                                className="px-6 py-3 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Back to Services
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 ${
                                    addingToCart ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {addingToCart ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <FaShoppingCart />
                                )}
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage; 