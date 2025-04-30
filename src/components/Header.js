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
import { Link } from "react-router-dom";

export default function Header() {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const navRef = useRef(null);

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
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
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
        <div ref={navRef} className="shadow-md">
            <div className="bg-[#034f87] text-white text-center text-sm py-1 font-semibold">
                One Stop Solution For All Your Compliance Needs
            </div>

            <div className="bg-white flex flex-col md:flex-row items-center justify-between py-3 px-4 gap-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-12 object-contain" />
                    </Link>
                    <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                </div>

                <div className="hidden md:flex flex-wrap items-center gap-6 text-[#034f87] text-sm">
                    <a href="tel:+917206071581" className="flex items-center gap-1 hover:text-cyan-600">
                        <FaPhoneAlt className="text-base" /> +91 7206071581
                    </a>
                    <div className="flex items-center gap-2">
                        <Link to="/register" className="flex items-center gap-1 hover:text-cyan-600">
                            <FaUser className="text-base" /> Register
                        </Link>
                        <span>|</span>
                        <Link to="/track-order" className="hover:text-cyan-600">Track Order</Link>
                    </div>
                    <Link to="/cart" className="relative hover:text-cyan-600">
                        <FaShoppingCart className="text-lg" />
                        <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs px-1.5 rounded-full">1</span>
                    </Link>
                    <Link to="/search" className="hover:text-cyan-600">
                        <FaSearch className="text-lg" />
                    </Link>
                </div>
            </div>

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
                            {item.submenu ? (
                                <div className="flex items-center justify-between gap-1 px-4 py-2 hover:text-cyan-200 transition-all">
                                    {item.name} <MdKeyboardArrowDown className="text-base" />
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="px-4 py-2 block hover:text-cyan-200 transition-all"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )}

                            {item.submenu && openMenu === item.name && (
                                <ul className="absolute md:group-hover:block bg-white text-[#0c5b91] shadow-lg rounded-md transition-all duration-200 ease-in-out min-w-[200px] top-full left-0 z-50 py-2 md:block">
                                    {item.submenu.map((sub, i) => (
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

                                                {!isMobile && (
                                                    <ul className="absolute left-full top-0 bg-white text-[#0c5b91] shadow-lg rounded-md min-w-[180px] py-2 z-50 hidden group-hover/sub:block">
                                                        {sub.nested.map((n, j) => (
                                                            <li key={j}>
                                                                <Link to={n.path} className="block px-4 py-2 hover:text-cyan-600">
                                                                    {n.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {isMobile && openSubMenu === sub.name && (
                                                    <ul className="absolute left-full top-0 bg-white text-[#0c5b91] shadow-lg rounded-md min-w-[180px] py-2 z-50">
                                                        {sub.nested.map((n, j) => (
                                                            <li key={j}>
                                                                <Link to={n.path} className="block px-4 py-2 hover:text-cyan-600" onClick={() => setMobileOpen(false)}>
                                                                    {n.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ) : (
                                            <li key={i}>
                                                <Link to={sub.path} className="block px-4 py-2 hover:text-cyan-600" onClick={() => setMobileOpen(false)}>
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
