import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaTrash, FaShoppingBag, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getCartItems, removeFromCart, createOrderFromCart, createPaymentOrder, verifyPayment } from '../services/api';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingItem, setRemovingItem] = useState(null);
    const [processingOrder, setProcessingOrder] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { removeFromCartState, refreshCart } = useCart();

    const fetchCartItems = useCallback(async () => {
        try {
            const items = await getCartItems();
            setCartItems(items || []); // Ensure it's always an array
            // Refresh global cart context to keep it in sync
            refreshCart();
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            toast.error('Failed to load cart items');
            setCartItems([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, [refreshCart]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchCartItems();
    }, [isAuthenticated, navigate, fetchCartItems]);

    // Refetch cart data when page becomes visible (handles tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && isAuthenticated) {
                fetchCartItems();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isAuthenticated, fetchCartItems]);

    const handleRemoveItem = async (serviceId) => {
        setRemovingItem(serviceId);
        try {
            await removeFromCart(serviceId);
            // Refetch the cart data from server to ensure consistency
            // This will also update the global cart context via fetchCartItems
            await fetchCartItems();
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Failed to remove item:', error);
            toast.error('Failed to remove item from cart');
        } finally {
            setRemovingItem(null);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            // Check if Razorpay is already loaded
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (order) => {
        const razorpayLoaded = await loadRazorpayScript();
        
        if (!razorpayLoaded) {
            toast.error('Failed to load payment gateway');
            return;
        }

        try {
            // Create payment order
            const paymentOrder = await createPaymentOrder(order.id);
            
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                name: 'ProtAcc',
                description: `Payment for Order ${paymentOrder.order_number}`,
                order_id: paymentOrder.razorpay_order_id,
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        
                        toast.success('Payment successful!');
                        navigate(`/orders/${order.order_number}`);
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        toast.error('Payment verification failed: ' + error);
                    }
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                },
                theme: {
                    color: '#4f46e5',
                },
                modal: {
                    ondismiss: () => {
                        toast.error('Payment cancelled');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Failed to initiate payment:', error);
            toast.error('Failed to initiate payment: ' + error);
        }
    };

    const handleCheckout = async () => {
        // Add null check here too
        if (!cartItems || cartItems.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setProcessingOrder(true);
        try {
            // Create order from cart
            const order = await createOrderFromCart();
            toast.success('Order created successfully!');
            
            // Clear cart since order was successful
            setCartItems([]);
            // Refresh global cart context
            refreshCart();
            
            // Initiate payment
            await handlePayment(order);
            
        } catch (error) {
            console.error('Failed to create order:', error);
            toast.error('Failed to create order: ' + error);
        } finally {
            setProcessingOrder(false);
        }
    };

    const calculateTotals = () => {
        // Add null/empty check for cartItems
        if (!cartItems || cartItems.length === 0) {
            return { totalAmount: 0, bookingAmount: 0, remainingAmount: 0 };
        }

        const totalAmount = cartItems.reduce((sum, item) => {
            // Add null checks for item and service
            const price = item?.service?.price || 0;
            return sum + price;
        }, 0);
        
        const bookingAmount = cartItems.reduce((sum, item) => {
            // Add null checks for item and service
            const booking = item?.service?.booking_amount || 0;
            return sum + booking;
        }, 0);
        
        const remainingAmount = totalAmount - bookingAmount;
        
        return { totalAmount, bookingAmount, remainingAmount };
    };

    const { totalAmount, bookingAmount, remainingAmount } = calculateTotals();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-6">Browse our services and add items to your cart</p>
                        <button
                            onClick={() => navigate('/services')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Browse Services
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems && cartItems.map((item) => {
                            // Add null safety for item and service
                            if (!item || !item.service) {
                                return null;
                            }
                            
                            return (
                            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {item.service.name || 'Unknown Service'}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{item.service.short_description || 'No description available'}</p>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Total Price</p>
                                                <p className="text-lg font-semibold text-indigo-600">
                                                    ₹{item.service.price || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Booking Amount</p>
                                                <p className="text-lg font-semibold text-green-600">
                                                    ₹{item.service.booking_amount || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleRemoveItem(item.service?.id || item.service_id)}
                                            disabled={removingItem === (item.service?.id || item.service_id)}
                                            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            {removingItem === (item.service?.id || item.service_id) ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaTrash />
                                            )}
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Number of Services</span>
                                <span>{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Total Amount</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-semibold">
                                <span>Booking Amount (Pay Now)</span>
                                <span>₹{bookingAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Remaining Amount</span>
                                <span>₹{remainingAmount}</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total to Pay Now</span>
                                    <span>₹{bookingAmount}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                disabled={processingOrder || cartItems.length === 0}
                                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingOrder ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaCreditCard />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={() => navigate('/services')}
                                className="w-full px-6 py-3 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-4">
                            * You only pay the booking amount now. The remaining amount can be paid after service delivery.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 