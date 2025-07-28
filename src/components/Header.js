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
            name: "Startup",
            submenu: [
                { name: "Proprietorship", path: "/services/proprietorship-registration" },
                { name: "Partnership", path: "/services/partnership-registration" },
                { name: "LLP - Limited Liability Partnership", path: "/services/llp-registration" },
                { name: "OPC - One Person Company", path: "/services/opc-registration" },
                { name: "Private Limited Company", path: "/services/private-limited-company" },
                { name: "Public Limited Company", path: "/services/public-limited-company" },
                { name: "Section 8 Company / NGO", path: "/services/section-8-ngo-registration" },
                { name: "Trust", path: "/services/trust-registration" },
                { name: "Producer Company", path: "/services/producer-company-registration" },
                { name: "Society", path: "/services/society-registration" },
                { name: "Co-Operative Society", path: "/services/cooperative-society-registration" },
            ],
        },
        {
            name: "Registrations",
            submenu: [
                { name: "Startup India", path: "/services/startup-india" },
                { name: "Shop Act Registration", path: "/services/shop-act-registration" },
                { name: "FSSAI Registration / Renewal", path: "/services/fssai-registration" },
                { name: "FSSAI License / Renewal", path: "/services/fssai-license" },
                { name: "IEC - Import Export Code", path: "/services/import-export-code" },
                { name: "ICEGATE Registration", path: "/services/icegate-registration" },
                { name: "LEI - Legal Entity Identifier Code", path: "/services/lei-registration" },
                { name: "ISO Registration", path: "/services/iso-registration" },
                { name: "Trademark Registration", path: "/services/trademark-registration" },
                { name: "Brandname Registration", path: "/services/brand-name-registration" },
                { name: "Logo Registration", path: "/services/logo-registration" },
                { name: "ESI Registration", path: "/services/esi-registration" },
                { name: "PF Registration", path: "/services/pf-registration" },
                { name: "Udyam Registration / MSME", path: "/services/udyam-msme-registration" },
            ],
        },
        {
            name: "Goods & Service Tax",
            submenu: [
                { name: "GST Registration", path: "/services/gst-registration" },
                { name: "GST Lut Form", path: "/services/gst-lut-form" },
                { name: "GST Amendment", path: "/services/gst-amendment" },
                { name: "GST Revocation", path: "/services/gst-revocation" },
                { name: "GST Number Transfer", path: "/services/gst-number-transfer" },
                { name: "GSTR - 10", path: "/services/gstr-10" },
                { 
                    name: "GST Returns", 
                    nested: [
                        { name: "GSTR 1", path: "/services/gstr-1-filing" },
                        { name: "GSTR 3B", path: "/services/gstr-3b-filing" },
                        { name: "CMP-08", path: "/services/cmp-08-filing" },
                        { name: "GST Annual Return (R9)", path: "/services/gst-annual-return-r9" },
                        { name: "GST Audit (9C)", path: "/services/gst-audit-9c" },
                    ],
                },
            ],
        },
        {
            name: "Income Tax",
            submenu: [
                { name: "PAN Registration", path: "/services/pan-registration" },
                { name: "TAN Registration", path: "/services/tan-registration" },
                { 
                    name: "Income Tax Returns", 
                    nested: [
                        { name: "ITR - 1", path: "/services/itr-1-filing" },
                        { name: "ITR - 2", path: "/services/itr-2-filing" },
                        { name: "ITR - 3", path: "/services/itr-3-filing" },
                        { name: "ITR - 4", path: "/services/itr-4-filing" },
                        { name: "ITR - 5", path: "/services/itr-5-filing" },
                        { name: "ITR - 6", path: "/services/itr-6-filing" },
                        { name: "ITR - 7", path: "/services/itr-7-filing" },
                    ],
                },
                { name: "Form 15CA-CB", path: "/services/form-15ca-cb" },
                { name: "TDS Return Filing", path: "/services/tds-return-filing" },
            ],
        },
        {
            name: "Notices",
            submenu: [
                { name: "GST Notice", path: "/services/gst-notice-handling" },
                { name: "Income Tax Notice", path: "/services/income-tax-notice-handling" },
                { name: "TDS Notice", path: "/services/tds-notice-handling" },
                { 
                    name: "Query / Objection", 
                    nested: [
                        { name: "Trademark", path: "/services/trademark-objection" },
                        { name: "Brand Name", path: "/services/brand-name-objection" },
                        { name: "Logo", path: "/services/logo-objection" },
                    ],
                },
            ],
        },
        {
            name: "Compliance",
            submenu: [
                { name: "Company Compliances", path: "/services/company-compliances" },
                { name: "LLP Compliances", path: "/services/llp-compliances" },
                { name: "FSSAI Return Filing", path: "/services/fssai-return-filing" },
                { name: "ESI Return Filing", path: "/services/esi-return-filing" },
                { name: "PF Return Filing", path: "/services/pf-return-filing" },
            ],
        },
        {
            name: "Additional Services",
            submenu: [
                { name: "Consultancy", path: "/services/consultancy" },
                { name: "Project Reports", path: "/services/project-reports" },
                { name: "CMA Data", path: "/services/cma-data" },
                { name: "Bookkeeping", path: "/services/bookkeeping" },
                { name: "Partnership Deed Drafting", path: "/services/partnership-deed-drafting" },
                { name: "Rent Agreement Drafting", path: "/services/rent-agreement-drafting" },
                { name: "Digital Signature", path: "/services/digital-signature" },
            ],
        },
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