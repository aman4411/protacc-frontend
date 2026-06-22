import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaServicestack,
    FaFileContract,
    FaEnvelope,
    FaPhoneAlt,
    FaSignOutAlt,
    FaCog,
    FaShoppingCart,
    FaBars,
    FaTimes,
    FaChevronDown,
    FaSearch,
    FaSpinner,
    FaClipboardList
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { searchServices, getServiceCategories } from '../services/api';
import toast from 'react-hot-toast';
import logo from '../logo.jpeg';
import { SITE_CONTACT } from '../config/siteContact';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [serviceCategories, setServiceCategories] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { cartCount } = useCart();
    const headerRef = useRef(null);
    const servicesRef = useRef(null);
    const searchRef = useRef(null);
    const profileRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Populate the Services dropdown from the live service categories.
    useEffect(() => {
        let isMounted = true;
        getServiceCategories()
            .then((data) => {
                if (isMounted && Array.isArray(data)) {
                    setServiceCategories(
                        data.map((category) => ({
                            id: category.id,
                            name: category.name,
                            path: `/services?category=${category.id}`,
                        }))
                    );
                }
            })
            .catch(() => {
                // Non-critical: dropdown falls back to just "View All Services".
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleSearch = useCallback(() => {
        setSearchOpen(!searchOpen);
        if (!searchOpen) {
            setTimeout(() => {
                document.getElementById('search-input')?.focus();
            }, 100);
        }
    }, [searchOpen]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Open search with Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggleSearch();
            }
            // Close search with Escape
            if (e.key === 'Escape') {
                setSearchOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [toggleSearch]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Handle click outside for dropdowns and mobile menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                setServicesOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
            if (
                mobileMenuOpen &&
                headerRef.current &&
                !headerRef.current.contains(event.target)
            ) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    // Search functionality
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearchLoading(true);
        try {
            await searchServices(searchQuery.trim());
            
            // Navigate to search page with results
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setMobileMenuOpen(false);
            setSearchQuery('');
        } catch (error) {
            toast.error('Failed to search services');
            console.error('Search error:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        setProfileOpen(false);
        navigate('/');
    };

    const navItems = [
        { name: 'Home', path: '/', icon: FaHome },
        { name: 'Services', path: '/services', icon: FaServicestack, hasDropdown: true },
        { name: 'Consultancy', path: '/consultancy', icon: FaFileContract },
        { name: 'Contact', path: '/contact', icon: FaEnvelope },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Backdrop for mobile menu — tap outside header to close */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
                : 'bg-white/90 backdrop-blur-sm shadow-md'
        }`}>
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <FaPhoneAlt className="text-xs" />
                                <span>{SITE_CONTACT.phoneDisplay}</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                                <FaEnvelope className="text-xs" />
                                <span>{SITE_CONTACT.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block">Free Consultation Available</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-xs">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <img 
                                    src={logo} 
                                    alt="ProtAcc" 
                                    className="h-12 w-12 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ProtAcc
                                </h1>
                                <p className="text-xs text-gray-600">Professional Services</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navItems.map((item) => (
                                <div key={item.name} className="relative" ref={item.hasDropdown ? servicesRef : null}>
                                    {item.hasDropdown ? (
                                        <button
                                            onClick={() => setServicesOpen(!servicesOpen)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100 ${
                                                isActive(item.path) 
                                                    ? 'text-indigo-600 bg-indigo-50' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                        >
                                            <item.icon className="text-sm" />
                                            {item.name}
                                            <FaChevronDown className={`text-xs transition-transform duration-300 ${
                                                servicesOpen ? 'rotate-180' : ''
                                            }`} />
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100 ${
                                                isActive(item.path) 
                                                    ? 'text-indigo-600 bg-indigo-50' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                        >
                                            <item.icon className="text-sm" />
                                            {item.name}
                                        </Link>
                                    )}

                                    {/* Services Dropdown */}
                                    {item.hasDropdown && servicesOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-800">Service Categories</h3>
                                            </div>
                                            {serviceCategories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={category.path}
                                                    onClick={() => setServicesOpen(false)}
                                                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <Link
                                                    to="/services"
                                                    onClick={() => setServicesOpen(false)}
                                                    className="block px-4 py-3 text-indigo-600 hover:bg-indigo-50 font-medium transition-colors duration-200"
                                                >
                                                    View All Services →
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4">
                            {/* Search Button */}
                            <div className="relative" ref={searchRef}>
                                <button 
                                    onClick={toggleSearch}
                                    title="Search (Ctrl+K)"
                                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                                >
                                    <FaSearch />
                                </button>

                                {/* Search Modal */}
                                {searchOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                        <form onSubmit={handleSearchSubmit} className="p-4">
                                            <div className="relative">
                                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    id="search-input"
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={handleSearchInputChange}
                                                    placeholder="Search services..."
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={searchLoading || !searchQuery.trim()}
                                                className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                                            >
                                                {searchLoading ? (
                                                    <>
                                                        <FaSpinner className="animate-spin" />
                                                        Searching...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaSearch />
                                                        Search Services
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* Cart Button */}
                            <Link
                                to="/cart"
                                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                            >
                                <FaShoppingCart className="text-lg" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {isAuthenticated ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <FaChevronDown className={`text-xs text-gray-600 transition-transform duration-300 hidden sm:block ${
                                            profileOpen ? 'rotate-180' : ''
                                        }`} />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {profileOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
                                                <p className="text-sm text-gray-600 capitalize">{user?.role || 'User'}</p>
                                            </div>
                                            
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <FaCog className="text-indigo-600" />
                                                Profile Settings
                                            </Link>
                                            
                                            <Link
                                                to="/orders"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <FaClipboardList className="text-indigo-600" />
                                                My Orders
                                            </Link>

                                            {user?.role === 'admin' && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <FaCog className="text-purple-600" />
                                                    Admin Panel
                                                </Link>
                                            )}
                                            
                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                                                >
                                                    <FaSignOutAlt />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="hidden sm:block px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                            >
                                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 animate-fadeIn">
                    <div className="container mx-auto px-4 py-6">
                        {/* Mobile Search */}
                        <div className="mb-6">
                            <form onSubmit={handleSearchSubmit} className="space-y-3">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                        placeholder="Search services..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={searchLoading || !searchQuery.trim()}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                                >
                                    {searchLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <FaSearch />
                                            Search Services
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {navItems.map((item) => (
                                <div key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                                            isActive(item.path) 
                                                ? 'text-indigo-600 bg-indigo-50' 
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <item.icon />
                                        {item.name}
                                    </Link>
                                    
                                    {/* Mobile Services Submenu */}
                                    {item.hasDropdown && (
                                        <div className="ml-6 mt-2 space-y-2">
                                            {serviceCategories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={category.path}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Auth Buttons */}
                            {!isAuthenticated && (
                                <div className="pt-4 border-t border-gray-200 space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full text-center px-4 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
        </>
    );
}