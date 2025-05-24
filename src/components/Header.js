import { useState, useEffect, useRef } from "react";
import logo from "../logo.jpeg";
import {
    FaPhoneAlt,
    FaUser,
    FaShoppingCart,
    FaSearch,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaClipboardList,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const navRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenMenu(null);
                setOpenSubMenu(null);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

    const menuItems = [
        { name: "Home", path: "/" },
        {
            name: "Business Startup Registrations",
            submenu: [
                { name: "Proprietorship Registration", path: "/business-startup-registrations/proprietorship-registration" },
                { name: "Private Limited Company Registration", path: "/business-startup-registrations/private-limited-company-registration" },
                { name: "Producer Company", path: "/business-startup-registrations/producer-company" },
                { name: "Partnership Firm Registration", path: "/business-startup-registrations/partnership-firm-registration" },
                { name: "Limited Liability Partnership", path: "/business-startup-registrations/limited-liability-partnership" },
                { name: "Section 8 Company/NGO", path: "/business-startup-registrations/section-8-company-ngo" },
                { name: "One Person Company Registration", path: "/business-startup-registrations/one-person-company-registration" },
                { name: "Public Limited Company", path: "/business-startup-registrations/public-limited-company" },
            ],
        },
        { name: "Digital Signature", path: "/digital-signature" },
        { name: "Trademark Registration", path: "/trademark" },
        {
            name: "Compliances",
            submenu: [
                { name: "PAN/TAN", 
                    nested: [
                        { name: "PAN Application", path: "/compliances/pan-application" },
                        { name: "TAN Application", path: "/compliances/tan-application" },
                    ],
                },
                { name: "Income Tax", 
                    nested: [
                        { name: "ITR 1", path: "/compliances/income-tax/itr-1" },
                        { name: "ITR 2", path: "/compliances/income-tax/itr-2" },
                        { name: "ITR 3", path: "/compliances/income-tax/itr-3" },
                        { name: "ITR 4", path: "/compliances/income-tax/itr-4" },
                        { name: "ITR 5", path: "/compliances/income-tax/itr-5" },
                        { name: "ITR 6", path: "/compliances/income-tax/itr-6" },
                    ],
                },
                {
                    name: "GST",
                    nested: [
                        { name: "GST Registration In India", path: "/compliances/gst/gst-registration" },
                        { name: "GST Filing (Monthly/Quarterly)", path: "/compliances/gst/gst-filing" },
                        { name: "GST Annual Filing (Monthly/Quarterly)", path: "/compliances/gst/gst-annual-filing" },
                    ],
                },
                {
                    name: "Annual Compliance",
                    nested: [
                        { name: "Proprietorship", path: "/compliances/annual-compliance/proprietorship" },
                        { name: "Partnership", path: "/compliances/annual-compliance/partnership" },
                        { name: "Private Limited Company", path: "/compliances/annual-compliance/private-limited-company" },
                        { name: "Limited Liability Partnership", path: "/compliances/annual-compliance/limited-liability-partnership" },
                    ],
                },  
                {
                    name: "Import Export Code", path: "/compliances/import-export-code",
                }
            ],
        },
        { name: "ISO", path: "/iso" },
        { name: "Consultancy", path: "/consultancy" },
    ];

    return (
        <div ref={navRef} className="shadow-lg">
            {/* <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white text-center py-2 font-semibold">
                <p className="text-sm md:text-base animate-fade-in">One Stop Solution For All Your Compliance Needs</p>
            </div> */}

            <div className="bg-white flex flex-col md:flex-row items-center justify-between py-4 px-6 gap-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link to="/" className="transition-transform hover:scale-105">
                        <img src={logo} alt="Logo" className="h-14 object-contain" />
                    </Link>
                    <button 
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <FaTimes className="text-xl text-indigo-600" /> : <FaBars className="text-xl text-indigo-600" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden w-full">
                        <div className="bg-white py-4 px-4 space-y-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-sm text-gray-600">{user?.email}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Link
                                                to="/cart"
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <FaShoppingCart className="text-xl" />
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <FaClipboardList className="text-xl" />
                                            </Link>
                                        </div>
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <FaUser className="mr-3" />
                                        Profile Settings
                                    </Link>

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileOpen(false);
                                        }}
                                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                                    >
                                        <FaSignOutAlt className="mr-3" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <FaUser className="mr-3" />
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Register
                                    </Link>
                                </>
                            )}

                            <div className="border-t border-gray-100 pt-4">
                                <a
                                    href="tel:+919817889933"
                                    className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <FaPhoneAlt className="mr-3" />
                                    +91 9817889933
                                </a>
                                <Link
                                    to="/track-order"
                                    className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Track Order
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop Menu */}
                <div className="hidden md:flex flex-wrap items-center gap-8 text-indigo-600 text-sm">
                    <a href="tel:+919817889933" className="flex items-center gap-2 hover:text-indigo-700 transition-colors">
                        <FaPhoneAlt className="text-base" /> +91 9817889933
                    </a>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="flex items-center gap-2 hover:text-indigo-700 transition-colors relative"
                                >
                                    <FaShoppingCart className="text-xl" />
                                    <span className="sr-only">Cart</span>
                                </Link>
                                <Link
                                    to="/orders"
                                    className="flex items-center gap-2 hover:text-indigo-700 transition-colors"
                                >
                                    <FaClipboardList className="text-xl" />
                                    <span className="sr-only">Orders</span>
                                </Link>
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 hover:text-indigo-700 transition-colors"
                                    >
                                        <FaUser className="text-xl" />
                                        <span className="sr-only">Profile</span>
                                    </button>
                                    {/* Profile Dropdown */}
                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                Profile Settings
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setProfileOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="flex items-center gap-2 hover:text-indigo-700 transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <span>Register</span>
                                </Link>
                                <span className="text-gray-300">|</span>
                                <Link
                                    to="/login"
                                    className="hover:text-indigo-700 transition-colors"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                        <Link to="/track-order" className="hover:text-indigo-700 transition-colors">Track Order</Link>
                    </div>
                    <Link to="/search" className="hover:text-indigo-700 transition-colors">
                        <FaSearch className="text-lg" />
                    </Link>
                </div>
            </div>

            <nav className={`bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm z-50 ${mobileOpen ? "block" : "hidden"} md:block transition-all duration-300 ease-in-out`}>
                <ul className="flex flex-col md:flex-row justify-center md:items-center gap-1 md:gap-8 px-4 py-4">
                    {menuItems.map((item, idx) => (
                        <li
                            key={idx}
                            className="relative group cursor-pointer"
                            onMouseEnter={() => !isMobile && item.submenu && toggleMenu(item.name)}
                            onMouseLeave={() => !isMobile && item.submenu && setOpenMenu(null)}
                            onClick={() => isMobile && item.submenu && toggleMenu(item.name)}
                        >
                            {item.submenu ? (
                                <div className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-white/10 rounded-md transition-all duration-200">
                                    {item.name} <MdKeyboardArrowDown className="text-base transition-transform group-hover:rotate-180" />
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="px-4 py-2 block hover:bg-white/10 rounded-md transition-all duration-200"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )}

                            {item.submenu && openMenu === item.name && (
                                <ul className="absolute md:group-hover:block bg-white text-indigo-600 shadow-xl rounded-lg transition-all duration-200 ease-in-out min-w-[220px] top-full left-0 z-50 py-2 md:block border border-gray-100">
                                    {item.submenu.map((sub, i) => (
                                        sub.nested ? (
                                            <li
                                                key={i}
                                                className="relative group/sub px-4 py-2 hover:bg-gray-50"
                                                onClick={(e) => {
                                                    if (isMobile) {
                                                        e.stopPropagation();
                                                        setOpenSubMenu(openSubMenu === sub.name ? null : sub.name);
                                                    }
                                                }}
                                                onMouseEnter={() => !isMobile && setOpenSubMenu(sub.name)}
                                                onMouseLeave={() => !isMobile && setOpenSubMenu(null)}
                                            >
                                                <div className="flex justify-between items-center text-indigo-600 hover:text-indigo-700 transition-colors">
                                                    {sub.name} <MdKeyboardArrowRight className="transition-transform group-hover/sub:translate-x-1" />
                                                </div>

                                                {!isMobile && (
                                                    <ul className="absolute left-full top-0 bg-white text-indigo-600 shadow-xl rounded-lg min-w-[200px] py-2 z-50 hidden group-hover/sub:block border border-gray-100">
                                                        {sub.nested.map((n, j) => (
                                                            <li key={j}>
                                                                <Link 
                                                                    to={n.path} 
                                                                    className="block px-4 py-2 hover:bg-gray-50 hover:text-indigo-700 transition-colors"
                                                                >
                                                                    {n.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {isMobile && openSubMenu === sub.name && (
                                                    <ul className="bg-white text-indigo-600 shadow-xl rounded-lg min-w-[200px] py-2 z-50 mt-2 border border-gray-100">
                                                        {sub.nested.map((n, j) => (
                                                            <li key={j}>
                                                                <Link 
                                                                    to={n.path} 
                                                                    className="block px-4 py-2 hover:bg-gray-50 hover:text-indigo-700 transition-colors"
                                                                    onClick={() => setMobileOpen(false)}
                                                                >
                                                                    {n.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ) : (
                                            <li key={i}>
                                                <Link 
                                                    to={sub.path} 
                                                    className="block px-4 py-2 hover:bg-gray-50 hover:text-indigo-700 transition-colors"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}