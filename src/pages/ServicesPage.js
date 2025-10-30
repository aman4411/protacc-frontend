import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
    FaShoppingCart, 
    FaSpinner, 
    FaCheck, 
    FaSearch, 
    FaFilter,
    FaStar,
    FaArrowRight,
    FaClock,
    FaBoxOpen
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getServices, getServiceCategories, addToCart } from '../services/api';

const ServicesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const { isAuthenticated } = useAuth();
    const { isInCart, addToCartSmart } = useCart();

    useEffect(() => {
        // Scroll to top when page loads or category changes
        window.scrollTo(0, 0);
        
        // Get category from URL params
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(parseInt(categoryParam));
        }
        
        // Trigger animation after component mounts
        setTimeout(() => setAnimateIn(true), 100);
    }, [searchParams]);

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if component unmounts
        
        const fetchData = async () => {
            try {
                const [servicesData, categoriesData] = await Promise.all([
                    getServices(selectedCategory),
                    getServiceCategories()
                ]);
                
                if (isMounted) { // Only update state if component is still mounted
                    setServices(servicesData);
                    setCategories(categoriesData);
                    setFilteredServices(servicesData);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error('Failed to load services');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [selectedCategory]);

    // Filter and sort services
    useEffect(() => {
        let filtered = [...services];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Price filter
        if (priceFilter) {
            filtered = filtered.filter(service => {
                const price = service.price;
                switch (priceFilter) {
                    case 'under-10k':
                        return price < 10000;
                    case '10k-50k':
                        return price >= 10000 && price < 50000;
                    case '50k-100k':
                        return price >= 50000 && price < 100000;
                    case 'over-100k':
                        return price >= 100000;
                    default:
                        return true;
                }
            });
        }

        // Sort services
        // Use priority sorting by default when no filters are applied
        const hasActiveFilters = searchTerm || priceFilter || selectedCategory;
        const effectiveSortBy = hasActiveFilters ? sortBy : 'priority';
        
        filtered.sort((a, b) => {
            switch (effectiveSortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'priority':
                default:
                    // Sort by service priority first, then category priority, then name
                    if (a.priority !== b.priority) {
                        return (a.priority || 999) - (b.priority || 999);
                    }
                    if (a.category?.priority !== b.category?.priority) {
                        return (a.category?.priority || 999) - (b.category?.priority || 999);
                    }
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredServices(filtered);
    }, [services, searchTerm, priceFilter, sortBy, selectedCategory]);

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
            toast.error('Please login to add items to cart');
            return;
        }

        if (isInCart(serviceId)) {
            toast.info('Item already in cart');
            return;
        }

        try {
            setAddingToCart(serviceId);
            await addToCart(serviceId, 1);
            addToCartSmart(serviceId);
            toast.success('Service added to cart');
        } catch (error) {
            toast.error(error || 'Failed to add to cart');
        } finally {
            setAddingToCart(null);
        }
    };

    const getSelectedCategoryName = () => {
        if (!selectedCategory) return 'All Services';
        const category = categories.find(cat => cat.id === selectedCategory);
        return category ? category.name : 'All Services';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading amazing services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-32 h-32 bg-yellow-300 opacity-10 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-pink-300 opacity-10 rounded-full animate-pulse"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
                        animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                            {getSelectedCategoryName()}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                            Professional services tailored to your business needs
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                <FaCheck className="mr-2 text-green-300" />
                                <span>Expert Solutions</span>
                            </div>
                            <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                <FaCheck className="mr-2 text-green-300" />
                                <span>Fast Delivery</span>
                            </div>
                            <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                <FaCheck className="mr-2 text-green-300" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Search and Filters */}
                <div className={`bg-white rounded-2xl shadow-xl p-6 mb-8 transform transition-all duration-700 delay-300 ${
                    animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <FaFilter />
                            Filters
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Prices</option>
                                    <option value="under-10k">Under ₹10,000</option>
                                    <option value="10k-50k">₹10,000 - ₹50,000</option>
                                    <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                                    <option value="over-100k">Over ₹1,00,000</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price-low">Price (Low to High)</option>
                                    <option value="price-high">Price (High to Low)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory || ''}
                                    onChange={(e) => handleCategoryChange(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Pills */}
                <div className={`flex flex-wrap gap-3 mb-8 transform transition-all duration-700 delay-500 ${
                    animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                            !selectedCategory 
                                ? 'bg-indigo-600 text-white shadow-lg' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                        }`}
                    >
                        All Services
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                                selectedCategory === category.id 
                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <div className={`mb-6 transform transition-all duration-700 delay-700 ${
                    animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <p className="text-gray-600 text-lg">
                        Found <span className="font-bold text-indigo-600">{filteredServices.length}</span> services
                        {searchTerm && (
                            <span> for "<span className="font-medium">{searchTerm}</span>"</span>
                        )}
                    </p>
                </div>

                {/* Services Grid */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-16">
                        <FaBoxOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No services found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setPriceFilter('');
                                setSelectedCategory(null);
                                setSearchParams({});
                            }}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onAddToCart={handleAddToCart}
                                isAdding={addingToCart === service.id}
                                isInCart={isInCart(service.id)}
                                isAuthenticated={isAuthenticated}
                                index={index}
                                animateIn={animateIn}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Service Card Component
const ServiceCard = ({ service, onAddToCart, isAdding, isInCart, isAuthenticated, index, animateIn }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div 
            className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group h-full flex flex-col ${
                animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ 
                transitionDelay: `${800 + index * 100}ms`,
                animation: animateIn ? `slideInUp 0.6s ease-out ${800 + index * 100}ms both` : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Header */}
            <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <div className="absolute top-2 right-2">
                    <div className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                        <span className="text-xs font-medium">{service.category?.name}</span>
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-3 pr-36 line-clamp-2 leading-tight">
                    {service.name}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-300 text-xs" />
                        ))}
                        <span className="text-sm ml-1 opacity-90">4.8</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm opacity-90">
                        <FaClock />
                        <span>{service.estimated_delivery_days} days</span>
                    </div>
                </div>
            </div>

            {/* Card Content - Flexible area */}
            <div className="p-6 flex-grow flex flex-col">
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {service.short_description}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                            {service.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                    <FaCheck className="text-green-500 mr-2 text-xs" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Spacer to push pricing and actions to bottom */}
                <div className="flex-grow"></div>

                {/* Pricing */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Starting from</span>
                        <span className="text-sm text-gray-600">Booking Amount</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(service.price)}
                        </div>
                        <div className="text-lg font-semibold text-indigo-600">
                            {formatPrice(service.booking_amount)}
                        </div>
                    </div>
                </div>

                {/* Actions - Always at bottom */}
                <div className="flex gap-3">
                    {isAuthenticated && isInCart ? (
                        <Link
                            to="/cart"
                            className="flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                        >
                            <FaShoppingCart />
                            View Cart
                        </Link>
                    ) : (
                        <button
                            onClick={() => onAddToCart(service.id)}
                            disabled={isAdding}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                                isAdding
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isAdding ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <FaShoppingCart />
                                    Add to Cart
                                </>
                            )}
                        </button>
                    )}

                    <Link
                        to={`/services/${service.slug}`}
                        className="px-4 py-3 border-2 border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                        <FaArrowRight />
                    </Link>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 pointer-events-none ${
                isHovered ? 'opacity-5' : ''
            }`}></div>
        </div>
    );
};

export default ServicesPage; 