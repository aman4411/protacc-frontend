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
    FaQuoteLeft
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
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Submit Another Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Expert Business Consultation Services
                        </h1>
                        <p className="text-xl mb-8 text-indigo-100">
                            Get personalized solutions for your business challenges. From compliance to growth strategies, 
                            our experts are here to guide you every step of the way.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center">
                                <FaCheckCircle className="text-green-400 mr-2" />
                                <span>Free Initial Consultation</span>
                            </div>
                            <div className="flex items-center">
                                <FaCheckCircle className="text-green-400 mr-2" />
                                <span>Expert Guidance</span>
                            </div>
                            <div className="flex items-center">
                                <FaCheckCircle className="text-green-400 mr-2" />
                                <span>Customized Solutions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Consultation?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We provide comprehensive business solutions tailored to your specific needs and goals.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaLightbulb className="text-2xl text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Strategic Insights</h3>
                            <p className="text-gray-600">Get actionable strategies to grow your business effectively.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaShieldAlt className="text-2xl text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Compliance Assurance</h3>
                            <p className="text-gray-600">Stay compliant with all regulatory requirements.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaChartLine className="text-2xl text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Growth Planning</h3>
                            <p className="text-gray-600">Develop comprehensive plans for sustainable growth.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaHandshake className="text-2xl text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
                            <p className="text-gray-600">Continuous support throughout your business journey.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-indigo-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-indigo-200">Businesses Served</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-indigo-200">Client Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24hrs</div>
                            <div className="text-indigo-200">Response Time</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">5+</div>
                            <div className="text-indigo-200">Years Experience</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Consultation Form Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Request Your Free Consultation
                            </h2>
                            <p className="text-gray-600">
                                Fill out the form below and our experts will get back to you with personalized recommendations.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
                        <p className="text-gray-600">Hear from businesses that have transformed with our guidance</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <FaQuoteLeft className="text-indigo-600 text-xl mr-2" />
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                                "Their expert guidance helped us navigate complex compliance requirements. 
                                Professional, reliable, and results-driven."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                    <FaUser className="text-indigo-600" />
                                </div>
                                <div>
                                    <div className="font-semibold">Rajesh Kumar</div>
                                    <div className="text-sm text-gray-600">CEO, TechStart Solutions</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <FaQuoteLeft className="text-indigo-600 text-xl mr-2" />
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                                "Outstanding service! They streamlined our entire business registration process 
                                and provided ongoing support."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                    <FaUser className="text-indigo-600" />
                                </div>
                                <div>
                                    <div className="font-semibold">Priya Sharma</div>
                                    <div className="text-sm text-gray-600">Founder, EcoFriendly Products</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <FaQuoteLeft className="text-indigo-600 text-xl mr-2" />
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                                "Their strategic insights helped us grow from a startup to a profitable business. 
                                Highly recommended!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                    <FaUser className="text-indigo-600" />
                                </div>
                                <div>
                                    <div className="font-semibold">Amit Patel</div>
                                    <div className="text-sm text-gray-600">Director, InnovateTech</div>
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
  