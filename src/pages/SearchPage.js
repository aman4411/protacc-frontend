import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaSpinner, FaShoppingCart, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { searchServices, addToCart } from '../services/api';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);
    const { isAuthenticated } = useAuth();
    const { isInCart, addToCartState } = useCart();

    useEffect(() => {
        const queryParam = searchParams.get('q');
        if (queryParam) {
            setQuery(queryParam);
            handleSearch(queryParam);
        }
    }, [searchParams]);

    const handleSearch = async (searchQuery = query) => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a search term');
            return;
        }

        setLoading(true);
        setHasSearched(true);
        
        try {
            const results = await searchServices(searchQuery.trim());
            setServices(results);
            
            // Update URL with search query
            setSearchParams({ q: searchQuery.trim() });
        } catch (error) {
            toast.error('Failed to search services');
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAddToCart = async (serviceId) => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }

        // If already in cart, navigate to cart page
        if (isInCart(serviceId)) {
            window.location.href = '/cart';
            return;
        }

        setAddingToCart(serviceId);
        try {
            await addToCart(serviceId);
            addToCartState(serviceId); // Update cart context
            toast.success('Service added to cart!');
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        to="/services" 
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to All Services
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Services</h1>
                    <p className="text-gray-600">Find the perfect service for your business needs</p>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Search for services, categories, or keywords..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                            />
                        </div>
                        <button
                            onClick={() => handleSearch()}
                            disabled={loading}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-medium"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <FaSearch />
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="flex items-center gap-3 text-gray-600">
                            <FaSpinner className="animate-spin text-xl" />
                            <span className="text-lg">Searching services...</span>
                        </div>
                    </div>
                )}

                {!loading && hasSearched && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {services.length === 0 
                                ? `No results found for "${query}"` 
                                : `Found ${services.length} service${services.length !== 1 ? 's' : ''} for "${query}"`
                            }
                        </h2>
                        {services.length === 0 && (
                            <div className="mt-4 text-gray-600">
                                <p>Try searching for:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Business registration</li>
                                    <li>Tax compliance</li>
                                    <li>GST filing</li>
                                    <li>Trademark registration</li>
                                    <li>Digital services</li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Service Results Grid */}
                {!loading && services.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    {/* Category Badge */}
                                    {service.category && (
                                        <div className="mb-3">
                                            <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                                {service.category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Service Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {service.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {service.description}
                                    </p>

                                    {/* Price and Delivery */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <span className="text-2xl font-bold text-indigo-600">
                                                ₹{service.price}
                                            </span>
                                            <div className="text-xs text-gray-500">
                                                Booking: ₹{service.booking_amount}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">
                                                {service.estimated_delivery_days} days
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Delivery
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/services/${service.slug}`}
                                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleAddToCart(service.id)}
                                            disabled={addingToCart === service.id}
                                            className={`px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium ${
                                                addingToCart === service.id 
                                                    ? 'bg-indigo-600 text-white'
                                                    : isInCart(service.id)
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                        >
                                            {addingToCart === service.id ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : isInCart(service.id) ? (
                                                <FaCheck />
                                            ) : (
                                                <FaShoppingCart />
                                            )}
                                            {isInCart(service.id) ? 'View Cart' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Search Yet */}
                {!hasSearched && !loading && (
                    <div className="text-center py-12">
                        <FaSearch className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-600 mb-2">Start Your Search</h2>
                        <p className="text-gray-500">
                            Enter keywords above to find services that match your business needs
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage; 