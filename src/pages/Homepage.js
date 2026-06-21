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
import { getServiceCategories } from '../services/api';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import { PAGE_SEO } from '../config/seo';
import { organizationSchema, faqSchema } from '../utils/structuredData';

// Import only testimonial images
import testimonial1Image from '../assets/images/testimonial-1.jpg';
import testimonial2Image from '../assets/images/testimonial-2.jpg';
import testimonial3Image from '../assets/images/testimonial-3.jpg';

const HOME_FAQS = [
    {
        question: 'Who is the best Chartered Accountant (CA) in Kaithal?',
        answer: 'Protacc is a trusted CA firm in Kaithal, Haryana offering GST registration, ITR filing, company registration, TDS returns, accounting and business compliance. You can book a free consultation by calling +91 9034819324.',
    },
    {
        question: 'What services does Protacc offer in Kaithal?',
        answer: 'Protacc provides GST registration & return filing, GST notice reply, income tax (ITR) filing, TDS return filing, private limited company / LLP / MSME registration, ROC & MCA compliance, accounting, bookkeeping, payroll, audit and tax planning services.',
    },
    {
        question: 'Can I file my GST return or ITR online with Protacc?',
        answer: 'Yes. Protacc offers online CA services across India. You can file GST returns, register for GST, and file your income tax return (ITR) online with expert support, without visiting the office.',
    },
    {
        question: 'How much does GST registration or ITR filing cost?',
        answer: 'Pricing depends on your business type and turnover. Browse our services page for transparent pricing, or book a free consultation and our tax consultants will share a quote tailored to your needs.',
    },
    {
        question: 'Does Protacc serve areas outside Kaithal?',
        answer: 'Yes. Besides Kaithal, Protacc serves clients across Haryana including Chandigarh and Gurgaon, and offers online CA services to businesses and individuals throughout India.',
    },
];

export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const [isStatsVisible, setIsStatsVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

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

    const testimonials = [
        {
            name: "Rajesh Kumar",
            company: "Tech Solutions Pvt Ltd",
            text: "ProtAcc's expertise in tax planning and compliance has been invaluable. They helped us save significantly on taxes while ensuring complete compliance. Their proactive approach is remarkable!",
            role: "CEO",
            image: testimonial1Image,
            rating: 5
        },
        {
            name: "Priya Sharma",
            company: "Retail Ventures",
            text: "The virtual CFO services have transformed our financial management. Their strategic insights helped us improve profitability by 40%. Best investment we've made!",
            role: "Director",
            image: testimonial2Image,
            rating: 5
        },
        {
            name: "Amit Patel",
            company: "StartUp Innovation Hub",
            text: "Outstanding support in our company registration and compliance. ProtAcc's team made the process seamless and their knowledge is unmatched in the industry.",
            role: "Founder",
            image: testimonial3Image,
            rating: 5
        }
    ];

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

                        {/* Dynamic Greeting */}
                        <div className="mb-8 animate-fadeInUp">
                            {isAuthenticated ? (
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-bold">
                                        Welcome Back, <span className="text-indigo-300">{user?.firstName}!</span>
                                    </h2>
                                    <p className="text-2xl text-indigo-200">
                                        Your Financial Success Partner
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Chartered Accountant</span> &amp; Tax Consultant in Kaithal
                                    </h1>
                                    <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto">
                                        Protacc is your trusted CA firm in Kaithal, Haryana for GST registration, ITR filing, company registration, TDS &amp; business compliance — online across India.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                            <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium border border-white/30">
                                ✨ AI-Powered Solutions
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

                    {/* Featured Testimonial */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
                            <FaQuoteLeft className="absolute top-6 left-6 text-4xl text-indigo-200" />
                            
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={testimonials[currentTestimonial].image} 
                                            alt={testimonials[currentTestimonial].name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-lg"
                                        />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <p className="text-xl text-gray-700 italic mb-6 leading-relaxed">
                                            "{testimonials[currentTestimonial].text}"
                                        </p>
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400" />
                                            ))}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</p>
                                            <p className="text-indigo-600 font-medium">{testimonials[currentTestimonial].role}</p>
                                            <p className="text-gray-500">{testimonials[currentTestimonial].company}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial Navigation */}
                            <div className="flex justify-center gap-3 mt-8">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === currentTestimonial 
                                                ? 'bg-indigo-600 w-8' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
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
                            Common questions about our CA, GST and tax services in Kaithal
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
