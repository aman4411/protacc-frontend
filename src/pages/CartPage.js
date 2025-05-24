import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getCartItems, removeFromCart, createOrder } from '../services/api';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingItem, setRemovingItem] = useState(null);
    const [processingOrder, setProcessingOrder] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchCartItems();
    }, [isAuthenticated, navigate]);

    const fetchCartItems = async () => {
        try {
            const items = await getCartItems();
            setCartItems(items);
        } catch (error) {
            toast.error('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (serviceId) => {
        setRemovingItem(serviceId);
        try {
            await removeFromCart(serviceId);
            setCartItems(cartItems.filter(item => item.service.id !== serviceId));
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item from cart');
        } finally {
            setRemovingItem(null);
        }
    };

    const handleCreateOrder = async (serviceId) => {
        setProcessingOrder(true);
        try {
            const order = await createOrder(serviceId);
            toast.success('Order created successfully');
            // Remove the ordered item from cart
            setCartItems(cartItems.filter(item => item.service.id !== serviceId));
            // Navigate to order details or payment page
            navigate(`/orders/${order.order_number}`);
        } catch (error) {
            toast.error('Failed to create order');
        } finally {
            setProcessingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (cartItems.length === 0) {
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
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {item.service.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{item.service.short_description}</p>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Total Price</p>
                                                <p className="text-lg font-semibold text-indigo-600">
                                                    ₹{item.service.price}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Booking Amount</p>
                                                <p className="text-lg font-semibold text-green-600">
                                                    ₹{item.service.booking_amount}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 items-center">
                                        <button
                                            onClick={() => handleRemoveItem(item.service.id)}
                                            disabled={removingItem === item.service.id}
                                            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            {removingItem === item.service.id ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaTrash />
                                            )}
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => handleCreateOrder(item.service.id)}
                                            disabled={processingOrder}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            {processingOrder ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                'Proceed to Pay'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Summary</h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Number of Items</span>
                                <span>{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900">
                                <span>Total Booking Amount</span>
                                <span>₹{cartItems.reduce((sum, item) => sum + item.service.booking_amount, 0)}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            * Each service requires a booking amount of ₹99. The remaining amount can be paid later.
                        </p>
                        <button
                            onClick={() => navigate('/services')}
                            className="w-full px-6 py-3 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 