import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    FaShoppingCart,
    FaSpinner,
    FaCheckCircle,
    FaClock,
    FaFileAlt,
    FaCheck,
    FaStar,
    FaShieldAlt,
    FaHeadset,
    FaRocket,
    FaArrowLeft,
    FaShare,
    FaCalendarAlt,
    FaRupeeSign,
    FaUsers,
    FaQuoteLeft,
    FaPlay,
    FaDownload,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaTelegramPlane,
    FaLink
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getServiceBySlug, addToCart, getServiceReviews, getReviewEligibility, submitReview } from '../services/api';
import { SITE_CONTACT } from '../config/siteContact';
import Seo from '../components/Seo';
import { getCanonicalUrl } from '../config/seo';
import { serviceSchema, breadcrumbSchema } from '../utils/structuredData';
import { formatDeliveryDays } from '../utils/delivery';
import Markdown from '../components/Markdown';

const ServiceDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [animateIn, setAnimateIn] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const shareRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 });
    const [eligibility, setEligibility] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const { isAuthenticated } = useAuth();
    const { isInCart, addToCartSmart } = useCart();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceBySlug(slug);

                // If we resolved via an old slug, redirect to the canonical URL.
                if (data.slug && data.slug !== slug) {
                    navigate(`/services/${data.slug}`, { replace: true });
                    return;
                }

                setService(data);

                // Load reviews + aggregate for this service (non-critical).
                try {
                    const reviewData = await getServiceReviews(data.id);
                    setReviews(reviewData.reviews || []);
                    setReviewSummary(reviewData.summary || { average: 0, count: 0 });
                } catch (e) { /* reviews are non-critical */ }

                // Check whether the logged-in user can review this service.
                if (isAuthenticated) {
                    try {
                        const elig = await getReviewEligibility(data.id);
                        setEligibility(elig);
                        if (elig?.existing) {
                            setReviewForm({ rating: elig.existing.rating, comment: elig.existing.comment || '' });
                        }
                    } catch (e) { /* non-critical */ }
                }
            } catch (error) {
                toast.error('Failed to load service details');
                navigate('/services');
            } finally {
                setLoading(false);
                setTimeout(() => setAnimateIn(true), 100);
            }
        };

        // Scroll to top when page loads
        window.scrollTo(0, 0);
        fetchService();
    }, [slug, navigate, isAuthenticated]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add services to cart');
            return;
        }

        if (service && isInCart(service.id)) {
            navigate('/cart');
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart(service.id);
            await addToCartSmart(service.id, service);
            toast.success('Service added to cart');
        } catch (error) {
            toast.error('Failed to add service to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleSubmitReview = async () => {
        if (reviewForm.rating < 1) {
            toast.error('Please select a star rating');
            return;
        }
        setSubmittingReview(true);
        try {
            await submitReview({ serviceId: service.id, rating: reviewForm.rating, comment: reviewForm.comment });
            toast.success('Thank you for your review!');
            const reviewData = await getServiceReviews(service.id);
            setReviews(reviewData.reviews || []);
            setReviewSummary(reviewData.summary || { average: 0, count: 0 });
            setEligibility((prev) => ({ ...(prev || {}), can_review: true, already_reviewed: true }));
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Close the share menu when clicking outside it.
    useEffect(() => {
        if (!shareOpen) return undefined;
        const onClickOutside = (e) => {
            if (shareRef.current && !shareRef.current.contains(e.target)) {
                setShareOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [shareOpen]);

    const handleShare = async () => {
        const url = getCanonicalUrl(`/services/${service.slug}`);
        const title = `${service.name} | ProtAcc`;
        // Native share sheet (mobile) — exposes WhatsApp, Facebook, Instagram, etc.
        if (navigator.share) {
            try {
                await navigator.share({ title, text: service.short_description || title, url });
            } catch (err) {
                // User dismissed the share sheet — nothing to do.
            }
            return;
        }
        // Desktop fallback — toggle a menu of explicit share links.
        setShareOpen((open) => !open);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getCanonicalUrl(`/services/${service.slug}`));
            toast.success('Link copied to clipboard');
        } catch (err) {
            toast.error('Could not copy link');
        }
        setShareOpen(false);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
                    <Link to="/services" className="text-indigo-600 hover:text-indigo-800">
                        Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    const serviceDescription =
        service.short_description ||
        (service.description ? String(service.description).slice(0, 160) : undefined);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header">
            <Seo
                title={`${service.name} | ProtAcc`}
                description={serviceDescription}
                path={`/services/${service.slug}`}
                type="product"
                jsonLd={[
                    serviceSchema(service, reviewSummary, reviews),
                    breadcrumbSchema([
                        { name: 'Home', url: getCanonicalUrl('/') },
                        { name: 'Services', url: getCanonicalUrl('/services') },
                        { name: service.name, url: getCanonicalUrl(`/services/${service.slug}`) },
                    ]),
                ]}
                jsonLdId="protacc-service-jsonld"
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
                    <div className="absolute top-32 right-20 w-32 h-32 bg-yellow-300 opacity-10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-pink-300 opacity-10 rounded-full animate-bounce"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className={`transform transition-all duration-1000 ${
                        animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-6 text-indigo-200">
                            <Link to="/services" className="hover:text-white transition-colors flex items-center gap-2">
                                <FaArrowLeft />
                                Services
                            </Link>
                            <span>/</span>
                            <span className="text-white">{service.name}</span>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Service Info */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                                        {service.category?.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < Math.round(reviewSummary.average) ? 'text-yellow-300 text-sm' : 'text-white/30 text-sm'} />
                                        ))}
                                        <span className="text-sm ml-2">
                                            {reviewSummary.count > 0
                                                ? `${reviewSummary.average.toFixed(1)} (${reviewSummary.count} review${reviewSummary.count === 1 ? '' : 's'})`
                                                : 'No reviews yet'}
                                        </span>
                                    </div>
                                </div>
                                
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                    {service.name}
                                </h1>
                                
                                <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                                    {service.short_description}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 mb-8">
                                    <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                        <FaClock className="text-green-300" />
                                        <span>{formatDeliveryDays(service.min_delivery_days, service.max_delivery_days)} delivery</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                        <FaShieldAlt className="text-blue-300" />
                                        <span>100% Secure</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                        <FaHeadset className="text-purple-300" />
                                        <span>24/7 Support</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                                <div className="text-center mb-6">
                                    <div className="text-sm text-gray-600 mb-2">Starting from</div>
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {formatPrice(service.price)}
                                    </div>
                                    <div className="text-lg text-indigo-600">
                                        Book now for {formatPrice(service.booking_amount)}
                                    </div>
                                </div>

                                {service.suited_for && service.suited_for.length > 0 && (
                                    <div className="mb-8">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Suited For</h4>
                                        <div className="space-y-3">
                                            {service.suited_for.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <FaCheck className="text-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
                                            addingToCart
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : isAuthenticated && isInCart(service.id)
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Adding to Cart...
                                            </>
                                        ) : isAuthenticated && isInCart(service.id) ? (
                                            <>
                                                <FaCheckCircle />
                                                View Cart
                                            </>
                                        ) : (
                                            <>
                                                <FaShoppingCart />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>

                                    <div className="relative" ref={shareRef}>
                                        <button
                                            onClick={handleShare}
                                            className="w-full py-3 px-4 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <FaShare />
                                            Share
                                        </button>

                                        {shareOpen && (
                                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20">
                                                {[
                                                    { label: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-600', href: `https://wa.me/?text=${encodeURIComponent(`${service.name} — ${getCanonicalUrl(`/services/${service.slug}`)}`)}` },
                                                    { label: 'Facebook', icon: FaFacebookF, color: 'text-blue-600', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getCanonicalUrl(`/services/${service.slug}`))}` },
                                                    { label: 'X (Twitter)', icon: FaTwitter, color: 'text-sky-500', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(getCanonicalUrl(`/services/${service.slug}`))}&text=${encodeURIComponent(service.name)}` },
                                                    { label: 'LinkedIn', icon: FaLinkedinIn, color: 'text-blue-700', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getCanonicalUrl(`/services/${service.slug}`))}` },
                                                    { label: 'Telegram', icon: FaTelegramPlane, color: 'text-sky-600', href: `https://t.me/share/url?url=${encodeURIComponent(getCanonicalUrl(`/services/${service.slug}`))}&text=${encodeURIComponent(service.name)}` },
                                                    { label: 'Email', icon: FaEnvelope, color: 'text-gray-600', href: `mailto:?subject=${encodeURIComponent(`${service.name} | ProtAcc`)}&body=${encodeURIComponent(getCanonicalUrl(`/services/${service.slug}`))}` },
                                                ].map(({ label, icon: Icon, color, href }) => (
                                                    <a
                                                        key={label}
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => setShareOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                                                    >
                                                        <Icon className={color} />
                                                        <span className="text-sm">{label}</span>
                                                    </a>
                                                ))}
                                                <button
                                                    onClick={handleCopyLink}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                                                >
                                                    <FaLink className="text-indigo-600" />
                                                    <span className="text-sm">Copy link</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Tabs Navigation */}
                <div className={`bg-white rounded-2xl shadow-xl mb-8 transform transition-all duration-700 delay-300 ${
                    animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="flex flex-wrap border-b border-gray-200">
                        {[
                            { id: 'overview', label: 'Overview', icon: FaFileAlt },
                            { id: 'features', label: 'Features', icon: FaRocket },
                            { id: 'requirements', label: 'Requirements', icon: FaCheckCircle },
                            { id: 'reviews', label: 'Reviews', icon: FaStar },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-8">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Service Overview</h3>
                                <div className="max-w-none">
                                    <Markdown>{service.description}</Markdown>

                                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h4>
                                            <ul className="space-y-2">
                                                {(service.whats_included && service.whats_included.length > 0
                                                    ? service.whats_included
                                                    : ['Complete documentation', 'Expert consultation', 'Follow-up support']
                                                ).map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <FaCheck className="text-green-500" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-center gap-2">
                                                    <FaStar className="text-yellow-500" />
                                                    <span>4.8+ rating from clients</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <FaUsers className="text-blue-500" />
                                                    <span>500+ satisfied customers</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <FaShieldAlt className="text-green-500" />
                                                    <span>100% money-back guarantee</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features Tab */}
                        {activeTab === 'features' && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                                {service.features && service.features.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {service.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                                <FaCheck className="text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No specific features listed for this service.</p>
                                )}
                            </div>
                        )}

                        {/* Requirements Tab */}
                        {activeTab === 'requirements' && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h3>
                                {service.requirements && service.requirements.length > 0 ? (
                                    <div className="space-y-4">
                                        {service.requirements.map((requirement, index) => (
                                            <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <FaFileAlt className="text-yellow-600 flex-shrink-0 mt-1" />
                                                <span className="text-gray-700">{requirement}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No specific requirements for this service.</p>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="animate-fadeIn">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

                                {/* Review Summary */}
                                {reviewSummary.count > 0 ? (
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-8 flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">{reviewSummary.average.toFixed(1)}</div>
                                            <div className="flex items-center gap-1 justify-center my-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < Math.round(reviewSummary.average) ? 'text-yellow-400' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-600">{reviewSummary.count} review{reviewSummary.count === 1 ? '' : 's'}</div>
                                        </div>
                                        <p className="text-gray-600 flex-1">Ratings come from customers who purchased this service.</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-6 rounded-xl mb-8 text-gray-600">
                                        No reviews yet. {isAuthenticated && eligibility?.can_review ? 'Be the first to review this service!' : 'Reviews from verified customers will appear here.'}
                                    </div>
                                )}

                                {/* Submit / edit review (eligible purchasers only) */}
                                {isAuthenticated && eligibility?.can_review && (
                                    <div className="border border-gray-200 rounded-xl p-6 mb-8">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            {eligibility?.already_reviewed ? 'Update your review' : 'Write a review'}
                                        </h4>
                                        <div className="flex items-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                                                    className="text-2xl focus:outline-none"
                                                    aria-label={`${star} star rating`}
                                                >
                                                    <FaStar className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                                            rows={4}
                                            placeholder="Share your experience with this service..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                                        />
                                        <button
                                            onClick={handleSubmitReview}
                                            disabled={submittingReview}
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {submittingReview ? <FaSpinner className="animate-spin" /> : null}
                                            {eligibility?.already_reviewed ? 'Update Review' : 'Submit Review'}
                                        </button>
                                    </div>
                                )}

                                {isAuthenticated && eligibility && !eligibility.can_review && (
                                    <p className="text-sm text-gray-500 mb-8">Only customers who have purchased this service can leave a review.</p>
                                )}

                                {/* Individual Reviews */}
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {(review.reviewer_name || 'C').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold text-gray-900">{review.reviewer_name || 'Verified customer'}</h4>
                                                            <FaCheckCircle className="text-green-500 text-sm" title="Verified Purchase" />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                                                ))}
                                                            </div>
                                                            <span>•</span>
                                                            <span>{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <div className="relative">
                                                    <FaQuoteLeft className="absolute -top-2 -left-2 text-gray-300 text-lg" />
                                                    <p className="text-gray-700 leading-relaxed pl-6">{review.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Section */}
                <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white transform transition-all duration-700 delay-500 ${
                    animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
                        <p className="text-indigo-100 mb-8">Our experts are here to help you make the right choice</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href={`tel:${SITE_CONTACT.phoneTel}`}
                                className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                            >
                                <FaPhone />
                                Call Us
                            </a>
                            <a
                                href={SITE_CONTACT.emailMailto}
                                className="flex items-center gap-2 bg-white bg-opacity-20 border border-white text-white px-6 py-3 rounded-xl hover:bg-opacity-30 transition-colors"
                            >
                                <FaEnvelope />
                                Email Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage; 