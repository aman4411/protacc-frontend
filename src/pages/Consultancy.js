import React, { useState, useEffect } from 'react';
import { 
    FaPhone, 
    FaEnvelope, 
    FaBuilding, 
    FaUser, 
    FaCheckCircle, 
    FaSpinner,
    FaLightbulb,
    FaHandshake,
    FaChartLine,
    FaShieldAlt,
    FaClock,
    FaUsers,
    FaStar,
    FaQuoteLeft,
    FaArrowDown
} from 'react-icons/fa';
import { createLead } from '../services/api';
import toast from 'react-hot-toast';

const Consultancy = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        business_type: '',
        services_interested: [],
        budget_range: '',
        preferred_contact_method: 'email',
        message: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Function to scroll to form section
    const scrollToForm = () => {
        const formSection = document.getElementById('consultation-form');
        if (formSection) {
            formSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const serviceOptions = [
        'GST Registration & Filing',
        'Income Tax Return (ITR)',
        'Business Registration',
        'Trademark & IP',
        'Financial Planning',
        'Compliance Management',
        'Bookkeeping Services',
        'Audit & Assurance',
        'Digital Marketing',
        'Business Consulting'
    ];

    const budgetRanges = [
        '₹10,000 - ₹50,000',
        '₹50,000 - ₹1,00,000',
        '₹1,00,000 - ₹5,00,000',
        '₹5,00,000 - ₹10,00,000',
        '₹10,00,000+'
    ];

    const businessTypes = [
        'Startup',
        'Small Business',
        'Medium Enterprise',
        'Large Corporation',
        'Freelancer/Professional',
        'Non-Profit Organization',
        'E-commerce',
        'Manufacturing',
        'Service Provider',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceChange = (service) => {
        setFormData(prev => ({
            ...prev,
            services_interested: prev.services_interested.includes(service)
                ? prev.services_interested.filter(s => s !== service)
                : [...prev.services_interested, service]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createLead(formData);
            setSubmitted(true);
            toast.success('Thank you! We will contact you soon.');
        } catch (error) {
            console.error('Error submitting lead:', error);
            toast.error(error || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-3xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-6">
                        Your consultation request has been submitted successfully. Our team will review your requirements and contact you within 24 hours.
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({
                                first_name: '',
                                last_name: '',
                                email: '',
                                phone: '',
                                company_name: '',
                                business_type: '',
                                services_interested: [],
                                budget_range: '',
                                preferred_contact_method: 'email',
                                message: ''
                            });
                        }}
                                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Submit Another Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-20 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-fadeIn">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                                Expert Business Consultation
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
                                Transform your business with personalized solutions. From compliance to growth strategies, 
                                our experts guide you to success.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base mb-8 animate-slideInUp">
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300">
                                <FaCheckCircle className="text-green-400 mr-2 text-lg" />
                                <span className="font-medium">Free Initial Consultation</span>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300">
                                <FaCheckCircle className="text-green-400 mr-2 text-lg" />
                                <span className="font-medium">Expert Guidance</span>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300">
                                <FaCheckCircle className="text-green-400 mr-2 text-lg" />
                                <span className="font-medium">Customized Solutions</span>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="animate-bounce">
                            <button 
                                onClick={scrollToForm}
                                className="text-center cursor-pointer hover:scale-105 transition-all duration-300 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl p-4 group w-full"
                                aria-label="Scroll to consultation form"
                            >
                                <p className="text-lg mb-4 text-white/80 group-hover:text-white transition-colors duration-300 font-medium">Ready to elevate your business?</p>
                                <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse group-hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <FaArrowDown className="text-xl group-hover:translate-y-1 transition-transform duration-300" />
                                </div>
                                <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Click to get started</p>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Floating Animation Elements */}
                <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-float"></div>
                <div className="absolute top-40 right-20 w-6 h-6 bg-white/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 left-1/4 w-5 h-5 bg-white/25 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeIn">
                            Why Choose Our Consultation?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed animate-slideInUp">
                            We provide comprehensive business solutions tailored to your specific needs and goals.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center group hover-lift">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <FaLightbulb className="text-3xl text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Strategic Insights</h3>
                            <p className="text-gray-600 leading-relaxed">Get actionable strategies to grow your business effectively.</p>
                        </div>
                        
                        <div className="text-center group hover-lift">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <FaShieldAlt className="text-3xl text-green-600 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Compliance Assured</h3>
                            <p className="text-gray-600 leading-relaxed">Stay compliant with all regulations and avoid legal issues.</p>
                        </div>
                        
                        <div className="text-center group hover-lift">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <FaUsers className="text-3xl text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Expert Team</h3>
                            <p className="text-gray-600 leading-relaxed">Work with certified professionals with years of experience.</p>
                        </div>
                        
                        <div className="text-center group hover-lift">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <FaClock className="text-3xl text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Quick Response</h3>
                            <p className="text-gray-600 leading-relaxed">Get responses within 24 hours and fast project delivery.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="group">
                            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">500+</div>
                            <div className="text-white/80 font-medium">Businesses Served</div>
                        </div>
                        <div className="group">
                            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">98%</div>
                            <div className="text-white/80 font-medium">Client Satisfaction</div>
                        </div>
                        <div className="group">
                            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24hrs</div>
                            <div className="text-white/80 font-medium">Response Time</div>
                        </div>
                        <div className="group">
                            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">5+</div>
                            <div className="text-white/80 font-medium">Years Experience</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Consultation Form Section */}
            <section id="consultation-form" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-fadeIn">
                                Request Your Free Consultation
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto animate-slideInUp">
                                Fill out the form below and our experts will get back to you with personalized recommendations within 24 hours.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaUser className="mr-2 text-indigo-600" />
                                        Personal Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Your first name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Your last name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaPhone className="mr-2 text-indigo-600" />
                                        Contact Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Contact Method
                                        </label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferred_contact_method"
                                                    value="email"
                                                    checked={formData.preferred_contact_method === 'email'}
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                />
                                                <FaEnvelope className="mr-1 text-gray-500" />
                                                Email
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferred_contact_method"
                                                    value="phone"
                                                    checked={formData.preferred_contact_method === 'phone'}
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                />
                                                <FaPhone className="mr-1 text-gray-500" />
                                                Phone
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferred_contact_method"
                                                    value="both"
                                                    checked={formData.preferred_contact_method === 'both'}
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                />
                                                Both
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaBuilding className="mr-2 text-indigo-600" />
                                        Business Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                name="company_name"
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Your company name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business Type
                                            </label>
                                            <select
                                                name="business_type"
                                                value={formData.business_type}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="">Select business type</option>
                                                {businessTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Services Interested */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Services You're Interested In
                                    </label>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {serviceOptions.map(service => (
                                            <label key={service} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.services_interested.includes(service)}
                                                    onChange={() => handleServiceChange(service)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">{service}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Budget Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Budget Range
                                    </label>
                                    <select
                                        name="budget_range"
                                        value={formData.budget_range}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Select budget range</option>
                                        {budgetRanges.map(range => (
                                            <option key={range} value={range}>{range}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tell us about your requirements
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Describe your business challenges, goals, or any specific requirements..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Request Free Consultation'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-fadeIn">What Our Clients Say</h2>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto animate-slideInUp">Hear from businesses that have transformed with our guidance</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                            <div className="flex items-center mb-6">
                                <FaQuoteLeft className="text-indigo-600 text-2xl mr-3" />
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-lg" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "Their expert guidance helped us navigate complex compliance requirements. 
                                Professional, reliable, and results-driven."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mr-4">
                                    <FaUser className="text-indigo-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">Rajesh Kumar</div>
                                    <div className="text-sm text-gray-600">CEO, TechStart Solutions</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                            <div className="flex items-center mb-6">
                                <FaQuoteLeft className="text-green-600 text-2xl mr-3" />
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-lg" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "Outstanding service! They streamlined our entire business registration process 
                                and provided ongoing support."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mr-4">
                                    <FaUser className="text-green-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">Priya Sharma</div>
                                    <div className="text-sm text-gray-600">Founder, EcoFriendly Products</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                            <div className="flex items-center mb-6">
                                <FaQuoteLeft className="text-purple-600 text-2xl mr-3" />
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-lg" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "Their strategic insights helped us grow from a startup to a profitable business. 
                                Highly recommended!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mr-4">
                                    <FaUser className="text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800">Amit Patel</div>
                                    <div className="text-sm text-gray-600">Director, Growth Ventures</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Consultancy;
  