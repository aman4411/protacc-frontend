import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaChartLine, FaArrowRight, FaSpinner, FaHandshake } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { getServiceCategories } from '../services/api';
import toast from 'react-hot-toast';

// Import only testimonial images
import testimonial1Image from '../assets/images/testimonial-1.jpg';
import testimonial2Image from '../assets/images/testimonial-2.jpg';
import testimonial3Image from '../assets/images/testimonial-3.jpg';

export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const [isStatsVisible, setIsStatsVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const statsRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getServiceCategories();
                setCategories(data);
            } catch (error) {
                toast.error('Failed to load service categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
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
        { number: 1000, label: "Happy Clients", suffix: "+" },
        { number: 15, label: "Years Experience", suffix: "+" },
        { number: 500, label: "Business Registrations", suffix: "+" },
        { number: 98, label: "Success Rate", suffix: "%" }
    ];

    const testimonials = [
        {
            name: "Rajesh Kumar",
            company: "Tech Solutions Pvt Ltd",
            text: "Their expertise in tax planning and compliance has been invaluable. They helped us save significantly on taxes while ensuring complete compliance.",
            role: "CEO",
            image: testimonial1Image
        },
        {
            name: "Priya Sharma",
            company: "Retail Ventures",
            text: "The virtual CFO services have transformed our financial management. Their strategic insights helped us improve profitability by 40%.",
            role: "Director",
            image: testimonial2Image
        },
        {
            name: "Amit Patel",
            company: "StartUp Innovation Hub",
            text: "Outstanding support in our company registration and compliance. Their team's proactive approach and deep knowledge made the process seamless.",
            role: "Founder",
            image: testimonial3Image
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-20 border-t border-indigo-500/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {isAuthenticated 
                                ? `Welcome Back, ${user?.firstName}!`
                                : 'Your Trusted Partner in Financial Excellence'
                            }
                        </h1>
                        <p className="text-xl mb-8 text-indigo-100">
                            {isAuthenticated
                                ? 'Continue managing your business compliance and registration needs'
                                : 'Expert guidance in taxation, audit, compliance, and business advisory services to help your business thrive'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition duration-300 flex items-center gap-2"
                                    >
                                        Go to Dashboard <FaArrowRight />
                                    </Link>
                                    <Link
                                        to="/consultancy"
                                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                                    >
                                        Book Consultation
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition duration-300"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/consultancy"
                                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                                    >
                                        Free Consultation
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            With decades of experience and a commitment to excellence, we provide comprehensive financial solutions tailored to your business needs
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaHandshake className="text-2xl text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                            <p className="text-gray-600">Qualified professionals with extensive experience in taxation and business advisory</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaChartLine className="text-2xl text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Proactive Approach</h3>
                            <p className="text-gray-600">We anticipate challenges and provide timely solutions to keep your business ahead</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheckCircle className="text-2xl text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Technology Driven</h3>
                            <p className="text-gray-600">Leveraging latest technology for efficient and accurate service delivery</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive financial and business solutions delivered with expertise and dedication
                        </p>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <FaSpinner className="animate-spin text-4xl text-indigo-600" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/services?category=${category.id}`}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 hover:border-indigo-100 border-2 border-transparent"
                                >
                                    <div className="text-center">
                                        {category.icon && (
                                            <div className="mb-4">
                                                <img 
                                                    src={`${process.env.REACT_APP_PROTACC_API_BASE_URL}${category.icon}`}
                                                    alt={category.name}
                                                    className="w-16 h-16 mx-auto object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/default-category.svg';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900">{category.name}</h3>
                                        <p className="text-gray-600">{category.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-8">
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            View All Services <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div ref={statsRef} className="bg-indigo-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="transform transition-transform hover:scale-105 duration-300">
                                <div className="text-3xl md:text-4xl font-bold mb-2">
                                    {isStatsVisible && (
                                        <CountUp
                                            start={0}
                                            end={stat.number}
                                            duration={2.5}
                                            separator=","
                                            suffix={stat.suffix}
                                            useEasing={true}
                                        />
                                    )}
                                </div>
                                <div className="text-indigo-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            See how we've helped businesses achieve their financial goals
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name} 
                                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-indigo-100"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">&ldquo;{testimonial.text}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        {isAuthenticated
                            ? 'Need Expert Financial Guidance?'
                            : 'Ready to Transform Your Business?'
                        }
                    </h2>
                    <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
                        {isAuthenticated
                            ? 'Schedule a consultation with our experts to discuss your business needs'
                            : 'Partner with us for comprehensive financial solutions and business growth'
                        }
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/services"
                                    className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition duration-300"
                                >
                                    Explore Services
                                </Link>
                                <Link
                                    to="/contact"
                                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                                >
                                    Contact Us
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition duration-300"
                                >
                                    Start Your Journey
                                </Link>
                                <Link
                                    to="/contact"
                                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                                >
                                    Schedule Consultation
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
