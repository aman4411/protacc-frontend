import { useState, useEffect, useRef } from "react";
import logo from "../logo.jpeg";
import {
    FaPhoneAlt,
    FaUser,
    FaShoppingCart,
    FaSearch,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

export default function Header() {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const navRef = useRef(null);

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const menuItems = [
        { name: "Home" },
        {
            name: "Business Startup Registrations",
            submenu: [
                { name: "Private Limited" },
                { name: "LLP" },
                {
                    name: "More Types",
                    nested: ["OPC", "NGO"],
                },
            ],
        },
        { name: "Digital Signature" },
        { name: "Trademark Registration" },
        {
            name: "Compliances",
            submenu: [
                { name: "GST Filing" },
                { name: "ITR Filing" },
                {
                    name: "TDS",
                    nested: ["Quarterly", "Yearly"],
                },
            ],
        },
        { name: "ISO" },
        { name: "Upload Documents" },
        { name: "Consultancy" },
    ];

    return (
        <div ref={navRef} className="shadow-md">
            {/* Top Bar */}
            <div className="bg-[#034f87] text-white text-center text-sm py-1 font-semibold">
                One Stop Solution For All Your Compliance Needs
            </div>

            {/* Middle Bar */}
            <div className="bg-white flex flex-col md:flex-row items-center justify-between py-3 px-4 gap-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <img
                        src={logo} 
                        alt="Logo"
                        className="h-12 object-contain"
                    />
                    <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                </div>

                <div className="hidden md:flex flex-wrap items-center gap-6 text-[#034f87] text-sm">
                    <a href="tel:+917206071581" className="flex items-center gap-1 hover:text-cyan-600">
                        <FaPhoneAlt className="text-base" /> +91 7206071581
                    </a>
                    <div className="flex items-center gap-2">
                        <a href="#" className="flex items-center gap-1 hover:text-cyan-600">
                            <FaUser className="text-base" /> Register
                        </a>
                        <span>|</span>
                        <a href="#" className="hover:text-cyan-600">Track Order</a>
                    </div>
                    <a href="#" className="relative hover:text-cyan-600">
                        <FaShoppingCart className="text-lg" />
                        <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs px-1.5 rounded-full">1</span>
                    </a>
                    <a href="#" className="hover:text-cyan-600">
                        <FaSearch className="text-lg" />
                    </a>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className={`bg-[#0c5b91] text-white text-sm z-50 ${mobileOpen ? "block" : "hidden"} md:block`}>
                <ul className="flex flex-col md:flex-row justify-center md:items-center gap-1 md:gap-6 px-2 py-3">
                    {menuItems.map((item, idx) => (
                        <li
                            key={idx}
                            className="relative group cursor-pointer"
                            onMouseEnter={() => !isMobile && item.submenu && toggleMenu(item.name)}
                            onMouseLeave={() => !isMobile && item.submenu && setOpenMenu(null)}
                            onClick={() => isMobile && item.submenu && toggleMenu(item.name)}
                        >
                            <div className="flex items-center justify-between gap-1 px-4 py-2 hover:text-cyan-300 transition-all">
                                {item.name}
                                {item.submenu && <MdKeyboardArrowDown className="text-base" />}
                            </div>

                            {item.submenu && openMenu === item.name && (
                                <ul className="absolute md:group-hover:block bg-white text-[#0c5b91] shadow-lg rounded-md transition-all duration-200 ease-in-out min-w-[200px] top-full left-0 z-50 py-2 md:block">
                                    {item.submenu.map((sub, i) =>
                                        sub.nested ? (
                                            <li
                                                key={i}
                                                className="relative group/sub px-4 py-2 hover:text-cyan-600"
                                                onClick={(e) => {
                                                    if (isMobile) {
                                                        e.stopPropagation();
                                                        setOpenSubMenu(openSubMenu === sub.name ? null : sub.name);
                                                    }
                                                }}
                                                onMouseEnter={() => !isMobile && setOpenSubMenu(sub.name)}
                                                onMouseLeave={() => !isMobile && setOpenSubMenu(null)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    {sub.name} <MdKeyboardArrowRight />
                                                </div>

                                                {/* Desktop: visible on hover using group-hover */}
                                                {!isMobile && (
                                                    <ul className="absolute left-full top-0 bg-white text-[#0c5b91] shadow-lg rounded-md min-w-[180px] py-2 z-50 hidden group-hover/sub:block">
                                                        {sub.nested.map((n, j) => (
                                                            <li key={j} className="px-4 py-2 hover:text-cyan-600">{n}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* Mobile: visible when openSubMenu is active */}
                                                {isMobile && openSubMenu === sub.name && (
                                                    <ul className="absolute left-full top-0 bg-white text-[#0c5b91] shadow-lg rounded-md min-w-[180px] py-2 z-50">
                                                        {sub.nested.map((n, j) => (
                                                            <li key={j} className="px-4 py-2 hover:text-cyan-600">{n}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>


                                        ) : (
                                            <li key={i} className="px-4 py-2 hover:text-cyan-600">{sub.name}</li>
                                        )
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
