import React, { useState, useEffect } from 'react';
import { 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaClock, 
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaCheckCircle,
    FaArrowRight,
    FaUser,
    FaComment,
    FaPhoneAlt,
    FaBuilding,
    FaGlobe,
    FaHeadset,
    FaCalendarAlt,
    FaQuestionCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { createContact } from '../services/api';
import { trackLead } from '../utils/analytics';
import { SITE_CONTACT } from '../config/siteContact';
import Seo from '../components/Seo';
import { PAGE_SEO } from '../config/seo';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        service_interest: '',
        preferred_contact: 'email'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => setAnimateIn(true), 100);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createContact(formData);
            trackLead('contact_form');

            toast.success('Message sent successfully! We will get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                subject: '',
                message: '',
                service_interest: '',
                preferred_contact: 'email'
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: FaPhone,
            title: 'Phone',
            content: SITE_CONTACT.phoneDisplay,
            description: SITE_CONTACT.businessHours.weekdays,
            action: `tel:${SITE_CONTACT.phoneTel}`,
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            icon: FaEnvelope,
            title: 'Email',
            content: SITE_CONTACT.email,
            description: 'We reply within 24 hours',
            action: SITE_CONTACT.emailMailto,
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            icon: FaWhatsapp,
            title: 'WhatsApp',
            content: SITE_CONTACT.phoneDisplay,
            description: 'Quick response available',
            action: SITE_CONTACT.whatsappUrl,
            gradient: 'from-green-500 to-green-600'
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Office',
            content: SITE_CONTACT.address.line1,
            description: SITE_CONTACT.address.short,
            action: SITE_CONTACT.googleBusinessUrl,
            gradient: 'from-red-500 to-red-600'
        }
    ];

    const features = [
        {
            icon: FaHeadset,
            title: '24/7 Support',
            description: 'Get help anytime with our dedicated support team'
        },
        {
            icon: FaCheckCircle,
            title: 'Expert Consultation',
            description: 'Free consultation with our professional advisors'
        },
        {
            icon: FaCalendarAlt,
            title: 'Quick Response',
            description: 'We respond to all inquiries within 24 hours'
        },
        {
            icon: FaGlobe,
            title: 'Pan-India Service',
            description: 'Serving clients across all major Indian cities'
        }
    ];

    const serviceInterests = [
        'Business Registration',
        'Tax Compliance',
        'Trademark & IP',
        'Digital Services',
        'Legal Notice Handling',
        'Bookkeeping Services',
        'Other'
    ];

    const contactSeo = PAGE_SEO.contact;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header">
            <Seo title={contactSeo.title} description={contactSeo.description} path={contactSeo.path} />
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center transition-all duration-1000 ${
                        animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full border border-indigo-200 mb-6">
                            <FaHeadset className="text-indigo-600 mr-2" />
                            <span className="text-sm font-medium text-indigo-700">Get Professional Support</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                                Contact Our Experts
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Ready to take your business to the next level? Our team of professional consultants 
                            is here to help you navigate complex regulations and grow your business.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="#contact-form"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                            >
                                <FaComment className="mr-2 group-hover:rotate-12 transition-transform" />
                                Send Message
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                            
                            <a
                                href={`tel:${SITE_CONTACT.phoneTel}`}
                                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                            >
                                <FaPhoneAlt className="mr-2 group-hover:rotate-12 transition-transform" />
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${
                                    animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                                style={{ 
                                    transitionDelay: `${200 + index * 100}ms`,
                                    animation: animateIn ? `slideInUp 0.6s ease-out ${200 + index * 100}ms both` : 'none'
                                }}
                            >
                                <div className="p-6 text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <info.icon className="text-2xl text-white" />
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                                    <p className="text-lg font-semibold text-gray-700 mb-1">{info.content}</p>
                                    <p className="text-sm text-gray-500 mb-4">{info.description}</p>
                                    
                                    <a
                                        href={info.action}
                                        target={info.action.startsWith('http') ? '_blank' : '_self'}
                                        rel={info.action.startsWith('http') ? 'noopener noreferrer' : ''}
                                        className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${info.gradient} text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium`}
                                    >
                                        Contact Now
                                        <FaArrowRight className="ml-2 text-xs" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content - Form and Info */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className={`transition-all duration-1000 ${
                            animateIn ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                        }`}>
                            <div id="contact-form" className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Send us a Message
                                    </h2>
                                    <p className="text-gray-600">
                                        Fill out the form below and our team will get back to you within 24 hours.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                    placeholder={SITE_CONTACT.phoneDisplay}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Company Name
                                            </label>
                                            <div className="relative">
                                                <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                    placeholder="Your company name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Service Interest
                                        </label>
                                        <select
                                            name="service_interest"
                                            value={formData.service_interest}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        >
                                            <option value="">Select a service</option>
                                            {serviceInterests.map((service, index) => (
                                                <option key={index} value={service}>{service}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Brief subject of your inquiry"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                                            placeholder="Tell us about your requirements..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Preferred Contact Method
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferred_contact"
                                                    value="email"
                                                    checked={formData.preferred_contact === 'email'}
                                                    onChange={handleInputChange}
                                                    className="mr-2 text-indigo-600"
                                                />
                                                Email
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferred_contact"
                                                    value="phone"
                                                    checked={formData.preferred_contact === 'phone'}
                                                    onChange={handleInputChange}
                                                    className="mr-2 text-indigo-600"
                                                />
                                                Phone
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferred_contact"
                                                    value="whatsapp"
                                                    checked={formData.preferred_contact === 'whatsapp'}
                                                    onChange={handleInputChange}
                                                    className="mr-2 text-indigo-600"
                                                />
                                                WhatsApp
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4 px-8 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                                            isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                <FaEnvelope />
                                                Send Message
                                                <FaArrowRight />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Information & Features */}
                        <div className={`transition-all duration-1000 ${
                            animateIn ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                        }`}>
                            {/* Office Hours */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white mb-8">
                                <div className="flex items-center mb-6">
                                    <FaClock className="text-3xl mr-4" />
                                    <div>
                                        <h3 className="text-2xl font-bold">Office Hours</h3>
                                        <p className="opacity-90">We're here when you need us</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Monday - Saturday</span>
                                        <span className="opacity-90">9:30 AM - 7:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Sunday</span>
                                        <span className="opacity-90">Closed</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/20">
                                    <p className="text-sm opacity-90">
                                        <FaQuestionCircle className="inline mr-2" />
                                        Emergency support available 24/7 for existing clients
                                    </p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
                                
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <div className="flex-shrink-0 mr-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <feature.icon className="text-white text-lg" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    {[
                                        { icon: FaFacebook, href: SITE_CONTACT.social.facebook, color: 'from-blue-500 to-blue-600', label: 'Facebook' },
                                        { icon: FaInstagram, href: SITE_CONTACT.social.instagram, color: 'from-pink-500 to-rose-600', label: 'Instagram' },
                                        { icon: FaWhatsapp, href: SITE_CONTACT.whatsappUrl, color: 'from-green-500 to-green-600', label: 'WhatsApp' }
                                    ].map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl`}
                                        >
                                            <social.icon className="text-lg" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Visit us at our Kaithal office. We are easily accessible from Dhand Road 
                            with parking available nearby.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <iframe
                            title="ProtAcc office location"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(SITE_CONTACT.address.full)}&output=embed`}
                            width="100%"
                            height="420"
                            style={{ border: 0, display: 'block' }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        ></iframe>
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-gray-600">
                                <FaMapMarkerAlt className="inline text-indigo-600 mr-2" />
                                {SITE_CONTACT.address.full}
                            </p>
                            <a
                                href={SITE_CONTACT.googleBusinessUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                            >
                                <FaMapMarkerAlt className="mr-2" />
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600">
                            Quick answers to common questions about our services and processes.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                question: "How quickly does ProtAcc respond to inquiries?",
                                answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, you can call us directly for immediate assistance."
                            },
                            {
                                question: "Does ProtAcc offer free consultations?",
                                answer: "Yes, we offer a free initial consultation to understand your requirements and provide preliminary guidance on the best approach for your business needs."
                            },
                            {
                                question: "What documents do I need to get started?",
                                answer: "The required documents vary by service. During our initial consultation, we'll provide you with a comprehensive list of documents specific to your requirements."
                            },
                            {
                                question: "Does ProtAcc serve clients across India?",
                                answer: "Absolutely! We serve clients across India and have experience with regulations in all major states. Many of our services can be handled remotely through digital communication and secure document sharing."
                            },
                            {
                                question: "Does ProtAcc provide on-site support at the client's location?",
                                answer: "Yes, we provide on-site support and visit client locations whenever required for audits, compliance reviews, business consultations, and other professional services, ensuring personalized assistance wherever our clients are located."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                    <FaQuestionCircle className="text-indigo-600 mr-3" />
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage; 