import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaUserTie, FaChartLine, FaClock, FaAward } from 'react-icons/fa';
import CountUp from 'react-countup';

export default function HomePage() {
    const [isStatsVisible, setIsStatsVisible] = useState(false);
    const statsRef = useRef(null);

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

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, []);

    const services = [
        {
            title: "Business Registration",
            description: "Get your business registered with expert guidance on choosing the right structure.",
            icon: <FaUserTie className="text-4xl text-indigo-600 mb-4" />,
            link: "/business-startup-registrations/private-limited-company-registration"
        },
        {
            title: "Tax Compliance",
            description: "Stay compliant with all tax regulations including GST, Income Tax, and TDS.",
            icon: <FaCheckCircle className="text-4xl text-indigo-600 mb-4" />,
            link: "/compliances/income-tax/itr-1"
        },
        {
            title: "Business Growth",
            description: "Strategic financial planning and advisory services for business growth.",
            icon: <FaChartLine className="text-4xl text-indigo-600 mb-4" />,
            link: "/consultancy"
        }
    ];

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
            text: "Outstanding service! They helped us incorporate our company and manage all compliances efficiently.",
            role: "CEO"
        },
        {
            name: "Priya Sharma",
            company: "Retail Ventures",
            text: "Their expertise in GST and tax planning has been invaluable for our business growth.",
            role: "Director"
        },
        {
            name: "Amit Patel",
            company: "StartUp Innovation Hub",
            text: "Professional team with deep knowledge of startup regulations and compliance requirements.",
            role: "Founder"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-20 border-t border-indigo-500/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Expert Financial Solutions for Your Business Success
                        </h1>
                        <p className="text-xl mb-8 text-indigo-100">
                            Comprehensive business registration, tax compliance, and advisory services to help your business thrive
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We provide comprehensive financial and business solutions with expertise and dedication
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Link
                                key={index}
                                to={service.link}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 hover:border-indigo-100 border-2 border-transparent"
                            >
                                <div className="text-center">
                                    {service.icon}
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            </Link>
                        ))}
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Don't just take our word for it - hear from some of our satisfied clients
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
                                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
                        Let us help you navigate the complexities of business registration and compliance
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/signup"
                            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition duration-300"
                        >
                            Register Now
                        </Link>
                        <Link
                            to="/contact"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
