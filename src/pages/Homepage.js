import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaCheckCircle, 
    FaChartLine, 
    FaArrowRight, 
    FaSpinner, 
    FaHandshake, 
    FaStar,
    FaPlay,
    FaShieldAlt,
    FaRocket,
    FaClock,
    FaUserTie,
    FaAward,
    FaQuoteLeft,
    FaLightbulb
} from 'react-icons/fa';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { getServiceCategories, getTopReviews, getHomepageCoupons } from '../services/api';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import { PAGE_SEO } from '../config/seo';
import { organizationSchema, faqSchema } from '../utils/structuredData';


const HOME_FAQS = [
    {
        question: 'Can I use Protacc’s CA services online from anywhere in India?',
        answer: 'Yes. Protacc is a fully online CA service — you can file GST returns, register for GST, file your income tax return (ITR), register a company and more from anywhere in India, without visiting an office. Everything is handled digitally with expert support.',
    },
    {
        question: 'What services does Protacc offer?',
        answer: 'Protacc provides GST registration & return filing, GST notice reply, income tax (ITR) filing, TDS return filing, private limited company / LLP / MSME registration, ROC & MCA compliance, accounting, bookkeeping, payroll, audit and tax planning services.',
    },
    {
        question: 'How does the online process work?',
        answer: 'Choose a service, share your documents securely online, and our Chartered Accountants complete the filing or registration for you — keeping you updated at every step. You can talk to an expert over call or WhatsApp whenever you need.',
    },
    {
        question: 'How much do GST registration, ITR filing or company registration cost?',
        answer: 'Pricing is transparent and listed on each service page. It depends on your business type and turnover — book a free consultation and our experts will share a quote tailored to your needs.',
    },
    {
        question: 'Do you also serve clients locally in Kaithal and Haryana?',
        answer: 'Yes. Protacc is based in Kaithal, Haryana, so local clients are welcome to visit — while our online services are available to individuals and businesses across all of India.',
    },
];

export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const [isStatsVisible, setIsStatsVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [topReviews, setTopReviews] = useState([]);
    const [promoCoupons, setPromoCoupons] = useState([]);
    const [promoIndex, setPromoIndex] = useState(0);
    const promoPausedRef = useRef(false);
    const statsRef = useRef(null);
    const heroRef = useRef(null);

    // Floating elements animation
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Parallax effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const hero = heroRef.current;
            if (hero) {
                hero.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Load top customer reviews for the testimonials section.
    useEffect(() => {
        let isMounted = true;
        getTopReviews(6)
            .then((data) => {
                if (isMounted && Array.isArray(data)) setTopReviews(data);
            })
            .catch(() => { /* non-critical: falls back to default reviews */ });
        getHomepageCoupons()
            .then((data) => {
                if (isMounted && Array.isArray(data)) setPromoCoupons(data);
            })
            .catch(() => { /* non-critical */ });
        return () => {
            isMounted = false;
        };
    }, []);

    // Auto-rotate the promo banner when more than one coupon is live (pause on hover).
    useEffect(() => {
        if (promoCoupons.length <= 1) return undefined;
        const id = setInterval(() => {
            if (!promoPausedRef.current) {
                setPromoIndex((i) => (i + 1) % promoCoupons.length);
            }
        }, 4500);
        return () => clearInterval(id);
    }, [promoCoupons.length]);

    const couponOffer = (c) => c.description || (c.discount_type === 'percentage'
        ? `${c.discount_value}% OFF${c.max_discount_amount ? ` up to ₹${c.max_discount_amount}` : ''}`
        : `₹${c.discount_value} OFF`);

    const copyCouponCode = (code) => {
        navigator.clipboard?.writeText(code)
            .then(() => toast.success(`Coupon ${code} copied!`))
            .catch(() => {});
    };

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if component unmounts
        
        const fetchCategories = async () => {
            try {
                const data = await getServiceCategories();
                if (isMounted) { // Only update state if component is still mounted
                    setCategories(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error('Failed to load service categories');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsStatsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.2,
            }
        );

        const currentRef = statsRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const stats = [
        { number: 1500, label: "Happy Clients", suffix: "+", icon: FaHandshake },
        { number: 20, label: "Years Experience", suffix: "+", icon: FaAward },
        { number: 800, label: "Business Registrations", suffix: "+", icon: FaRocket },
        { number: 99, label: "Success Rate", suffix: "%", icon: FaChartLine }
    ];

    // Shown only when there are no real reviews yet (text-only, no images).
    const fallbackReviews = [
        {
            name: "Rajesh K.",
            text: "ProtAcc's expertise in tax planning and compliance has been invaluable. They helped us save significantly while staying fully compliant. Their proactive approach is remarkable!",
            context: "Tax & Compliance",
            rating: 5
        },
        {
            name: "Priya S.",
            text: "The team made GST registration and return filing completely hassle-free. Clear guidance at every step and quick turnaround. Highly recommended.",
            context: "GST Services",
            rating: 5
        },
        {
            name: "Amit P.",
            text: "Outstanding support with our company registration and compliance. The process was seamless and their knowledge is unmatched.",
            context: "Company Registration",
            rating: 5
        }
    ];

    // Prefer real reviews; fall back to the curated text reviews above.
    const reviewsToShow = topReviews.length > 0
        ? topReviews.map((r) => ({
              name: r.reviewer_name || 'Verified customer',
              text: r.comment,
              context: r.service_name,
              rating: r.rating,
          }))
        : fallbackReviews;

    const features = [
        {
            icon: FaShieldAlt,
            title: "100% Secure & Compliant",
            description: "Bank-level security with complete regulatory compliance",
            color: "from-green-400 to-green-600"
        },
        {
            icon: FaClock,
            title: "24/7 Expert Support",
            description: "Round-the-clock assistance from certified professionals",
            color: "from-blue-400 to-blue-600"
        },
        {
            icon: FaLightbulb,
            title: "Smart Solutions",
            description: "AI-powered insights for optimal business decisions",
            color: "from-purple-400 to-purple-600"
        },
        {
            icon: FaUserTie,
            title: "Dedicated Account Manager",
            description: "Personal relationship manager for all your needs",
            color: "from-orange-400 to-orange-600"
        }
    ];

    const homeSeo = PAGE_SEO.home;

    return (
        <div className="min-h-screen bg-gray-50 pt-header">
            <Seo
                title={homeSeo.title}
                description={homeSeo.description}
                path={homeSeo.path}
                jsonLd={[organizationSchema(), faqSchema(HOME_FAQS)]}
            />
            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div 
                    className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
                        top: '10%',
                        left: '10%',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
                <div 
                    className="absolute w-80 h-80 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
                        top: '60%',
                        right: '10%',
                        animation: 'float 8s ease-in-out infinite reverse'
                    }}
                />
            </div>

            {/* Hero Section */}
            <div
                ref={heroRef}
                className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-32 overflow-hidden"
            >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern animate-pulse"></div>
                </div>
                
                {/* Hero Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* ProtAcc Brand */}
                        <div className="mb-8 transform hover:scale-105 transition-all duration-500">
                            <div className="text-7xl md:text-8xl font-black mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent animate-gradient">
                                ProtAcc
                            </div>
                            <div className="h-1 w-32 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
                        </div>

                        {/* Headline — consistent across logged-in / logged-out */}
                        <div className="mb-8 animate-fadeInUp">
                            {isAuthenticated && (
                                <p className="text-lg text-indigo-200 mb-3">
                                    Welcome back, <span className="text-white font-semibold">{user?.firstName}</span> 👋
                                </p>
                            )}
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Chartered Accountant</span> for GST, ITR &amp; Company Registration
                                </h1>
                                <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto">
                                    File returns, register your business and stay compliant — 100% online, with expert Chartered Accountants serving clients across India.
                                </p>
                            </div>
                        </div>

                        {/* Coupon / Campaign offers — auto-rotating carousel when multiple are live */}
                        {promoCoupons.length > 0 && (() => {
                            const current = promoCoupons[promoIndex % promoCoupons.length];
                            return (
                                <div className="mb-10 flex flex-col items-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                    <div
                                        onMouseEnter={() => { promoPausedRef.current = true; }}
                                        onMouseLeave={() => { promoPausedRef.current = false; }}
                                        className="w-full max-w-xl flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-left transition-all"
                                    >
                                        <span className="text-2xl flex-shrink-0">🎉</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-white leading-tight text-sm">{couponOffer(current)}</p>
                                            <p className="text-xs text-indigo-200 mt-0.5">
                                                Code <span className="font-bold tracking-wide text-white">{current.code}</span>
                                                {current.min_order_amount ? ` · above ₹${current.min_order_amount}` : ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyCouponCode(current.code)}
                                            className="flex-shrink-0 px-3 py-2 bg-white text-indigo-700 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    {promoCoupons.length > 1 && (
                                        <div className="flex justify-center gap-2 mt-3">
                                            {promoCoupons.map((c, i) => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => setPromoIndex(i)}
                                                    aria-label={`Show offer ${i + 1}`}
                                                    className={`h-2 rounded-full transition-all ${i === (promoIndex % promoCoupons.length) ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                            <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium border border-white/30">
                                ✨ Expert Chartered Accountants
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium border border-white/30">
                                🚀 Fast Processing
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium border border-white/30">
                                🔒 100% Secure
                            </span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/services"
                                        className="group bg-gradient-to-r from-white to-indigo-50 text-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaRocket className="group-hover:animate-bounce" />
                                        Explore Services
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="group border-2 border-white/50 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-indigo-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaUserTie />
                                        My Profile
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="group bg-gradient-to-r from-white to-indigo-50 text-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaPlay className="group-hover:animate-pulse" />
                                        Get Started Free
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/consultancy"
                                        className="group border-2 border-white/50 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-indigo-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaLightbulb />
                                        Free Consultation
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
                    <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                </div>
                <div className="absolute top-40 right-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
                    <div className="w-6 h-6 bg-indigo-400/50 rounded-full"></div>
                </div>
                <div className="absolute bottom-20 left-1/4 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}>
                    <div className="w-3 h-3 bg-purple-400/40 rounded-full"></div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fadeInUp">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ProtAcc</span>?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Experience the future of financial services with our cutting-edge technology and expert guidance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 animate-fadeInUp"
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                <div className={`h-16 w-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="text-2xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-20 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 animate-fadeInUp">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Services</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive financial and business solutions delivered with expertise and innovation
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <FaSpinner className="animate-spin text-6xl text-indigo-600" />
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category, index) => (
                                <Link
                                    key={category.id}
                                    to={`/services?category=${category.id}`}
                                    className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 animate-fadeInUp"
                                    style={{animationDelay: `${index * 0.1}s`}}
                                >
                                    <div className="text-center">
                                        {category.icon && (
                                            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                                <div className="relative">
                                                    <img 
                                                        src={`${process.env.REACT_APP_PROTACC_API_BASE_URL}${category.icon}`}
                                                        alt={category.name}
                                                        className="w-20 h-20 mx-auto object-contain"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/images/default-category.svg';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-6">{category.description}</p>
                                        <div className="flex items-center justify-center text-indigo-600 font-semibold group-hover:text-indigo-700">
                                            Explore Services 
                                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <div ref={statsRef} className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-hero-shimmer"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Numbers That Speak</h2>
                        <p className="text-xl text-indigo-200">Our track record of excellence</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={index} 
                                className="text-center group transform hover:scale-110 transition-all duration-500 animate-fadeInUp"
                                style={{animationDelay: `${index * 0.2}s`}}
                            >
                                <div className="mb-4">
                                    <stat.icon className="text-4xl mx-auto text-indigo-300 group-hover:text-white transition-colors" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                                    {isStatsVisible && (
                                        <CountUp
                                            start={0}
                                            end={stat.number}
                                            duration={3}
                                            separator=","
                                            suffix={stat.suffix}
                                            useEasing={true}
                                        />
                                    )}
                                </div>
                                <div className="text-indigo-200 font-semibold text-lg">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Testimonials Section */}
            <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fadeInUp">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">Client Success Stories</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover how ProtAcc has transformed businesses across industries
                        </p>
                    </div>

                    {/* Reviews grid (text-only, no images) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {reviewsToShow.map((review, index) => (
                            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <FaQuoteLeft className="text-3xl text-indigo-200 mb-4" />
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic mb-6 leading-relaxed">"{review.text}"</p>
                                <div>
                                    <p className="font-bold text-gray-900">{review.name}</p>
                                    {review.context && (
                                        <p className="text-indigo-600 text-sm font-medium">{review.context}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-hero-shimmer"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                            {isAuthenticated
                                ? 'Ready to Accelerate Your Growth?'
                                : 'Ready to Transform Your Business?'
                            }
                        </h2>
                        <p className="text-2xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                            {isAuthenticated
                                ? 'Unlock new opportunities with ProtAcc\'s expert financial guidance and innovative solutions'
                                : 'Join thousands of successful businesses who trust ProtAcc for their financial excellence'
                            }
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/services"
                                        className="group bg-gradient-to-r from-white to-indigo-50 text-indigo-600 px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaRocket className="group-hover:animate-bounce" />
                                        Explore All Services
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/consultancy"
                                        className="group border-2 border-white/50 backdrop-blur-sm text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-indigo-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaUserTie />
                                        Book Consultation
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="group bg-gradient-to-r from-white to-indigo-50 text-indigo-600 px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaPlay className="group-hover:animate-pulse" />
                                        Start Your Journey
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/consultancy"
                                        className="group border-2 border-white/50 backdrop-blur-sm text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-indigo-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaLightbulb />
                                        Free Consultation
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center items-center gap-8 text-indigo-200">
                            <div className="flex items-center gap-2">
                                <FaShieldAlt />
                                <span>100% Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaAward />
                                <span>Award Winning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock />
                                <span>24/7 Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaChartLine />
                                <span>Proven Results</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Common questions about our online CA, GST and tax services across India
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {HOME_FAQS.map((faq, index) => (
                            <details
                                key={index}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-gray-900">
                                    {faq.question}
                                    <span className="ml-4 text-indigo-600 transition-transform group-open:rotate-45">+</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
