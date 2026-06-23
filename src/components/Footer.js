import { Link } from "react-router-dom";
import { 
    FaEnvelope, 
    FaPhoneAlt, 
    FaMapMarkerAlt,
    FaFacebookF, 
    FaInstagram, 
    FaWhatsapp,
    FaArrowUp,
    FaShieldAlt,
    FaClock,
    FaHeadset,
    FaRocket,
    FaHeart,
    FaStar
} from "react-icons/fa";
import logo from "../logo.jpeg";
import { useState, useEffect } from "react";
import { SITE_CONTACT } from "../config/siteContact";

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute top-32 right-20 w-32 h-32 bg-indigo-300 rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-300 rounded-full"></div>
                <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-blue-300 rounded-full"></div>
            </div>

            {/* Newsletter Section */}
            {/* <div className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Latest Business Insights</h3>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Get expert tips, regulatory updates, and exclusive offers delivered to your inbox
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-white outline-none"
                        />
                        <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold whitespace-nowrap">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div> */}

            {/* Main Footer Content */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={logo} alt="ProtAcc" className="h-12 w-12 rounded-xl" />
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    ProtAcc
                                </h3>
                                <p className="text-gray-400 text-sm">Professional Services</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Your trusted partner for all compliance and business registration needs. 
                            We simplify complex processes to help your business thrive.
                        </p>

                        {/* Trust Indicators */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-green-400" />
                                <span className="text-sm text-gray-300">100% Secure & Confidential</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaClock className="text-blue-400" />
                                <span className="text-sm text-gray-300">Fast Processing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaHeadset className="text-purple-400" />
                                <span className="text-sm text-gray-300">24/7 Expert Support</span>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Follow Us:</span>
                            <div className="flex gap-3">
                                <a href={SITE_CONTACT.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110" aria-label="Facebook">
                                    <FaFacebookF className="text-sm" />
                                </a>
                                <a href={SITE_CONTACT.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-110" aria-label="Instagram">
                                    <FaInstagram className="text-sm" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative">
                            Quick Links
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    All Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/consultancy" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    Free Consultation
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    My Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative">
                            Popular Services
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/services?category=1" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    Business Registration
                                </Link>
                            </li>
                            <li>
                                <Link to="/services?category=2" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    GST Registration
                                </Link>
                            </li>
                            <li>
                                <Link to="/services?category=3" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    Income Tax Filing
                                </Link>
                            </li>
                            <li>
                                <Link to="/services?category=4" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                                    Trademark Registration
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 flex items-center gap-2 group font-medium">
                                    <FaRocket className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                                    View All Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative">
                            Get in Touch
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="group">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                                    <FaMapMarkerAlt className="text-indigo-400 mt-1 group-hover:text-indigo-300 transition-colors" />
                                    <div>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {SITE_CONTACT.address.line1}<br />
                                            {SITE_CONTACT.address.line2}<br />
                                            {SITE_CONTACT.address.line3}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <a href={`tel:${SITE_CONTACT.phoneTel}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                                    <FaPhoneAlt className="text-green-400 group-hover:text-green-300 transition-colors" />
                                    <div>
                                        <p className="text-white font-medium">{SITE_CONTACT.phoneDisplay}</p>
                                        <p className="text-gray-400 text-sm">{SITE_CONTACT.businessHours.weekdays}</p>
                                    </div>
                                </a>
                            </div>

                            <div className="group">
                                <a href={SITE_CONTACT.emailMailto} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                                    <FaEnvelope className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                                    <div>
                                        <p className="text-white font-medium">{SITE_CONTACT.email}</p>
                                        <p className="text-gray-400 text-sm">24/7 Email Support</p>
                                    </div>
                                </a>
                            </div>

                            <div className="group">
                                <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                                    <FaWhatsapp className="text-green-500 group-hover:text-green-400 transition-colors" />
                                    <div>
                                        <p className="text-white font-medium">WhatsApp Chat</p>
                                        <p className="text-gray-400 text-sm">Quick responses</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <p>© {currentYear} ProtAcc. All rights reserved.</p>
                            <div className="hidden md:flex items-center gap-4">
                                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                                <span>•</span>
                                <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                                <span>•</span>
                                <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>Made with</span>
                                <FaHeart className="text-red-500 animate-pulse" />
                                <span>in India</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400 text-sm" />
                                ))}
                                <span className="text-sm text-gray-400 ml-2">4.8/5 Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Legal Links */}
                    <div className="md:hidden flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}
        </footer>
    );
}