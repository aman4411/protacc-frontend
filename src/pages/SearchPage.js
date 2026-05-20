import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
    FaSearch, 
    FaSpinner, 
    FaShoppingCart, 
    FaArrowLeft, 
    FaFilter,
    FaStar,
    FaHeart,
    FaEye,
    FaBoxOpen,
    FaTags,
    FaClock
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { searchServices, addToCart } from '../services/api';

// ServiceCard Component
const ServiceCard = ({ service, addingToCart, handleAddToCart, isInCart, isAuthenticated, index }) => {
    const [cardAnimated, setCardAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setCardAnimated(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 overflow-hidden group h-full flex flex-col ${
            cardAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
            {/* Service Header */}
            <div className="relative p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                {/* Category Badge */}
                {service.category && (
                    <div className="absolute top-2 right-2">
                        <span className="inline-block px-2.5 py-0.5 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg">
                            {service.category.name}
                        </span>
                    </div>
                )}

                {/* Service Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 pr-36 leading-tight">
                    {service.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {service.description}
                </p>
            </div>

            {/* Service Body - Flexible area */}
            <div className="p-6 pt-0 flex-grow flex flex-col">
                {/* Spacer to push pricing and actions to bottom */}
                <div className="flex-grow"></div>

                {/* Price and Delivery */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ₹{service.price}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Booking: ₹{service.booking_amount}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-indigo-600 font-medium">
                            <FaClock className="text-xs" />
                            <span>{service.estimated_delivery_days} days</span>
                        </div>
                        <div className="text-xs text-gray-500">Delivery</div>
                    </div>
                </div>

                {/* Actions - Always at bottom */}
                <div className="flex gap-3">
                    <Link
                        to={`/services/${service.slug}`}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 text-center text-sm font-medium transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <FaEye className="text-xs" />
                        View Details
                    </Link>
                    
                    {isAuthenticated ? (
                        isInCart(service.id) ? (
                            <Link
                                to="/cart"
                                className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-center text-sm font-medium transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <FaShoppingCart className="text-xs" />
                                View Cart
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleAddToCart(service.id)}
                                disabled={addingToCart === service.id}
                                className={`px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                    addingToCart === service.id 
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                                }`}
                            >
                                {addingToCart === service.id ? (
                                    <FaSpinner className="animate-spin text-xs" />
                                ) : (
                                    <FaShoppingCart className="text-xs" />
                                )}
                                {addingToCart === service.id ? 'Adding...' : 'Add to Cart'}
                            </button>
                        )
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-center text-sm font-medium transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <FaShoppingCart className="text-xs" />
                            Login to Add
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);
    const [animateIn, setAnimateIn] = useState(false);
    const { isAuthenticated } = useAuth();
    const { isInCart, addToCartSmart } = useCart();

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);
        
        const queryParam = searchParams.get('q');
        if (queryParam) {
            setQuery(queryParam);
            handleSearch(queryParam);
        }
        
        // Trigger animation after component mounts
        setTimeout(() => setAnimateIn(true), 100);
    }, [searchParams]);

    const handleSearch = useCallback(async (searchQuery = query) => {
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
    }, [searchParams, query]); // Added searchParams and query to dependencies

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

        // Find the service data to pass to cart context
        const serviceData = services.find(s => s.id === serviceId);

        setAddingToCart(serviceId);
        try {
            await addToCart(serviceId);
            await addToCartSmart(serviceId, serviceData);
            toast.success('Service added to cart!');
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-16 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className={`transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {/* Back Link */}
                            <Link 
                                to="/services" 
                                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors duration-300 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to All Services
                            </Link>
                            
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                                Search Services
                            </h1>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Find the perfect service for your business needs with our comprehensive search
                            </p>
                            
                            {/* Search Stats */}
                            {hasSearched && (
                                <div className="flex justify-center items-center gap-2 text-white/80">
                                    <FaSearch className="text-lg" />
                                    <span className="text-lg">
                                        {services.length === 0 
                                            ? `No results found for "${query}"` 
                                            : `Found ${services.length} service${services.length !== 1 ? 's' : ''} for "${query}"`
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Search Box */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Search for services, categories, or keywords..."
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg placeholder-gray-400 transition-all duration-300"
                                />
                            </div>
                            <button
                                onClick={() => handleSearch()}
                                disabled={loading}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[160px]"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin text-xl" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <FaSearch className="text-lg" />
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {/* Search Tips */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-600 mb-3 font-medium">Popular searches:</p>
                            <div className="flex flex-wrap gap-2">
                                {['ITR Filing', 'GST Registration', 'Trademark', 'Business Registration', 'Tax Compliance'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => {
                                            setQuery(suggestion);
                                            handleSearch(suggestion);
                                        }}
                                        className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 border border-indigo-200 hover:border-indigo-300"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <FaSpinner className="animate-spin text-white text-xl" />
                                </div>
                                <p className="text-xl text-gray-700 font-medium">Searching services...</p>
                                <p className="text-gray-500 mt-2">Finding the best matches for you</p>
                            </div>
                        </div>
                    )}

                    {/* No Results Message */}
                    {!loading && hasSearched && services.length === 0 && (
                        <div className="text-center py-16">
                            <div className="max-w-2xl mx-auto">
                                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaSearch className="text-3xl text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">No services found</h3>
                                <p className="text-gray-600 mb-8">We couldn't find any services matching your search. Try these popular categories:</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                    {[
                                        { name: 'Business Registration', icon: FaBoxOpen, color: 'from-blue-500 to-blue-600' },
                                        { name: 'Tax Compliance', icon: FaTags, color: 'from-green-500 to-green-600' },
                                        { name: 'GST Filing', icon: FaClock, color: 'from-purple-500 to-purple-600' },
                                        { name: 'Trademark Registration', icon: FaStar, color: 'from-orange-500 to-orange-600' },
                                        { name: 'Digital Services', icon: FaEye, color: 'from-pink-500 to-pink-600' },
                                        { name: 'ITR Filing', icon: FaHeart, color: 'from-indigo-500 to-indigo-600' },
                                    ].map((suggestion) => (
                                        <button
                                            key={suggestion.name}
                                            onClick={() => {
                                                setQuery(suggestion.name);
                                                handleSearch(suggestion.name);
                                            }}
                                            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-gray-200"
                                        >
                                            <div className={`w-12 h-12 bg-gradient-to-r ${suggestion.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                                                <suggestion.icon className="text-white text-lg" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">{suggestion.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Results Grid */}
                    {!loading && services.length > 0 && (
                        <div className="space-y-8">
                            {/* Results Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Search Results ({services.length})
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FaFilter className="text-indigo-600" />
                                    <span>Showing all matches for "{query}"</span>
                                </div>
                            </div>

                            {/* Services Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {services.map((service, index) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        addingToCart={addingToCart}
                                        handleAddToCart={handleAddToCart}
                                        isInCart={isInCart}
                                        isAuthenticated={isAuthenticated}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SearchPage; 