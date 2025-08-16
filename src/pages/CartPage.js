import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaSpinner, 
    FaTrash, 
    FaShoppingBag, 
    FaShoppingCart, 
    FaCreditCard,
    FaArrowLeft,
    FaLock,
    FaCheckCircle,
    FaGift,
    FaPercent,
    FaTruck,
    FaHeadset,
    FaShieldAlt,
    FaPlus,
    FaMinus,
    FaTags,
    FaClock,
    FaHeart,
    FaSearch,
    FaAward
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getCartItems, removeFromCart, createOrderFromCart, createPaymentOrder, verifyPayment } from '../services/api';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingItem, setRemovingItem] = useState(null);
    const [processingOrder, setProcessingOrder] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { removeFromCartState, refreshCart } = useCart();

    const fetchCartItems = useCallback(async () => {
        try {
            const items = await getCartItems();
            setCartItems(items || []);
            refreshCart();
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            toast.error('Failed to load cart items');
            setCartItems([]);
        } finally {
            setLoading(false);
            setTimeout(() => setAnimateIn(true), 100);
        }
    }, [refreshCart]);

    // Scroll to top only once when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // Empty dependency array - runs only once

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        fetchCartItems();
    }, [isAuthenticated, navigate, fetchCartItems]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && isAuthenticated) {
                fetchCartItems();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [fetchCartItems, isAuthenticated]);

    const handleRemoveItem = async (serviceId) => {
        try {
            setRemovingItem(serviceId);
            await removeFromCart(serviceId);
            removeFromCartState(serviceId);
            await fetchCartItems();
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setRemovingItem(null);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        try {
            setProcessingOrder(true);

            // Create order first
            const orderData = await createOrderFromCart();
            toast.success('Order created successfully');

            // Load Razorpay script
            const razorpayLoaded = await loadRazorpay();
            if (!razorpayLoaded) {
                toast.error('Payment gateway failed to load');
                return;
            }

            // Create payment order
            const paymentOrder = await createPaymentOrder(orderData.order.id);

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                name: 'ProtAcc Services',
                description: `Payment for Order #${orderData.order.order_number}`,
                order_id: paymentOrder.id,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderData.order.id
                        });
                        
                        toast.success('Payment successful!');
                        navigate(`/orders/${orderData.order.order_number}`);
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'Customer',
                    email: 'customer@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#4F46E5'
                }
            };

            const paymentWindow = new window.Razorpay(options);
            paymentWindow.open();

        } catch (error) {
            console.error('Order placement failed:', error);
            toast.error(error || 'Failed to place order');
        } finally {
            setProcessingOrder(false);
        }
    };

    const applyPromoCode = () => {
        if (promoCode.toLowerCase() === 'save10') {
            setPromoApplied(true);
            toast.success('Promo code applied! 10% discount added.');
        } else {
            toast.error('Invalid promo code');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.service?.price || 0), 0);
        const discount = promoApplied ? subtotal * 0.1 : 0;
        return {
            subtotal,
            discount,
            total: subtotal - discount
        };
    };

    const calculateBookingTotal = () => {
        const bookingTotal = cartItems.reduce((sum, item) => sum + (item.service?.booking_amount || 0), 0);
        const discount = promoApplied ? bookingTotal * 0.1 : 0;
        return bookingTotal - discount;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header">
                {/* Empty Cart Hero Section */}
                <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="animate-bounce mb-6">
                            <FaShoppingCart className="text-6xl mx-auto mb-4 opacity-80" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Cart is Empty</h1>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Start building your professional services package by exploring our comprehensive offerings
                        </p>
                        <button
                            onClick={() => navigate('/services')}
                            className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                        >
                            <FaSearch />
                            Explore Services
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose ProtAcc?</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Discover the benefits of our professional services</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <FaAward className="text-4xl text-indigo-600" />,
                                    title: "Expert Professionals",
                                    description: "Certified experts with years of experience"
                                },
                                {
                                    icon: <FaClock className="text-4xl text-green-600" />,
                                    title: "Quick Turnaround",
                                    description: "Fast and efficient service delivery"
                                },
                                {
                                    icon: <FaShieldAlt className="text-4xl text-blue-600" />,
                                    title: "100% Secure",
                                    description: "Your data and payments are completely secure"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    const totals = calculateTotal();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className={`transform transition-all duration-1000 ${
                        animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <div className="flex items-center gap-3 mb-6 text-indigo-200">
                            <Link to="/services" className="hover:text-white transition-colors flex items-center gap-2">
                                <FaArrowLeft />
                                Continue Shopping
                            </Link>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Cart</h1>
                        <p className="text-xl text-indigo-100">
                            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-700 delay-300 ${
                            animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <FaShoppingBag className="text-indigo-600" />
                                    Your Items
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item, index) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                        isRemoving={removingItem === item.service_id}
                                        index={index}
                                        animateIn={animateIn}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-700 delay-500 ${
                            animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FaCreditCard className="text-indigo-600" />
                                    Order Summary
                                </h3>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Promo Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Promo Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={promoApplied}
                                        />
                                        <button
                                            onClick={applyPromoCode}
                                            disabled={promoApplied || !promoCode}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {promoApplied && (
                                        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                                            <FaCheckCircle />
                                            <span>10% discount applied</span>
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatPrice(totals.subtotal)}</span>
                                    </div>
                                    {promoApplied && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount (10%)</span>
                                            <span>-{formatPrice(totals.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Booking Amount (Pay Now)</span>
                                        <span className="font-medium text-indigo-600">{formatPrice(calculateBookingTotal())}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Service Value</span>
                                        <span className="text-indigo-600">{formatPrice(totals.total)}</span>
                                    </div>
                                </div>

                                {/* Payment Note */}
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <FaCheckCircle className="text-indigo-600 mt-0.5" />
                                        <div className="text-sm text-indigo-800">
                                            <p className="font-medium mb-1">Pay only booking amount now</p>
                                            <p>Remaining amount will be collected after service completion</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Features */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaLock className="text-green-600" />
                                        <span>Secure SSL encryption</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaShieldAlt className="text-blue-600" />
                                        <span>Money-back guarantee</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaHeadset className="text-purple-600" />
                                        <span>24/7 customer support</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={processingOrder}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl"
                                >
                                    {processingOrder ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaLock />
                                            Pay {formatPrice(calculateBookingTotal())}
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    By placing this order, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Cart Item Component
const CartItem = ({ item, onRemove, isRemoving, index, animateIn }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div 
            className={`p-6 transition-all duration-500 hover:bg-gray-50 ${
                animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ 
                transitionDelay: `${300 + index * 100}ms`,
                animation: animateIn ? `slideInUp 0.6s ease-out ${300 + index * 100}ms both` : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start gap-6">
                {/* Service Info */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FaTags className="text-indigo-600 text-sm" />
                                <span className="text-sm text-gray-600">{item.service?.category?.name}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {item.service?.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {item.service?.short_description}
                            </p>
                        </div>
                        
                        <button
                            onClick={() => onRemove(item.service_id)}
                            disabled={isRemoving}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                isRemoving 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                            }`}
                            title="Remove from cart"
                        >
                            {isRemoving ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaTrash />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FaClock />
                                <span>{item.service?.estimated_delivery_days} days</span>
                            </div>
                            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                <FaHeart />
                                <span>Save for later</span>
                            </button>
                        </div>
                        
                        <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                                {formatPrice(item.service?.price)}
                            </div>
                            <div className="text-sm text-indigo-600">
                                Book for {formatPrice(item.service?.booking_amount)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 pointer-events-none ${
                isHovered ? 'opacity-5' : ''
            }`}></div>
        </div>
    );
};

export default CartPage; 