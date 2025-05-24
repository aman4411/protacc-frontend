import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getServices, getServiceCategories, addToCart } from '../services/api';

const ServicesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Get category from URL params
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(parseInt(categoryParam));
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesData, categoriesData] = await Promise.all([
                    getServices(selectedCategory),
                    getServiceCategories()
                ]);
                setServices(servicesData);
                setCategories(categoriesData);
            } catch (error) {
                toast.error('Failed to load services');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCategory]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            setSearchParams({ category: categoryId });
        } else {
            setSearchParams({});
        }
    };

    const handleAddToCart = async (serviceId) => {
        if (!isAuthenticated) {
            toast.error('Please login to add services to cart');
            return;
        }

        setAddingToCart(serviceId);
        try {
            await addToCart(serviceId);
            toast.success('Service added to cart');
        } catch (error) {
            toast.error('Failed to add service to cart');
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose from our comprehensive range of professional services tailored to meet your business needs
                    </p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`px-6 py-2 rounded-full transition-colors ${
                            !selectedCategory
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-indigo-50'
                        }`}
                    >
                        All Services
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={`px-6 py-2 rounded-full transition-colors ${
                                selectedCategory === category.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-indigo-50'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                                    <span className="text-indigo-600 font-semibold">₹{service.price}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{service.short_description}</p>
                                
                                {/* Features */}
                                {service.features && service.features.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            {service.features.slice(0, 3).map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Booking Amount</p>
                                        <p className="text-lg font-semibold text-indigo-600">₹{service.booking_amount}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/services/${service.slug}`}
                                            className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleAddToCart(service.id)}
                                            disabled={addingToCart === service.id}
                                            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 ${
                                                addingToCart === service.id ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {addingToCart === service.id ? (
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
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No services found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage; 