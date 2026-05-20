import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaArrowLeft, FaClock, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getOrderByNumber, getOrderStatusHistory, createPaymentOrder, verifyPayment } from '../services/api';

const OrderStatusBadge = ({ status }) => {
    const getStatusColor = (orderStatus) => {
        switch (orderStatus) {
            case 'pending_booking_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'booking_amount_received':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'documents_required':
                return 'bg-orange-100 text-orange-800';
            case 'documents_received':
                return 'bg-indigo-100 text-indigo-800';
            case 'in_progress':
                return 'bg-cyan-100 text-cyan-800';
            case 'pending_final_payment':
                return 'bg-amber-100 text-amber-800';
            case 'full_payment_received':
                return 'bg-emerald-100 text-emerald-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            // Legacy status support
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'payment_received':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (orderStatus) => {
        return orderStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {formatStatus(status)}
        </span>
    );
};

const OrderDetailPage = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

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

    const handlePayment = async () => {
        if (!order) {
            toast.error('Order data not available');
            return;
        }

        console.log('Starting payment process for order:', order.id);
        setProcessingPayment(true);
        
        try {
            const razorpayLoaded = await loadRazorpayScript();
            
            if (!razorpayLoaded) {
                toast.error('Failed to load payment gateway');
                return;
            }

            console.log('Creating payment order...');
            // Create payment order
            let paymentOrder;
            try {
                paymentOrder = await createPaymentOrder(order.id);
                console.log('Payment order created:', paymentOrder);
            } catch (paymentOrderError) {
                console.error('Failed to create payment order:', paymentOrderError);
                toast.error('Failed to create payment order: ' + (paymentOrderError.message || paymentOrderError.toString()));
                return;
            }
            
            const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
            console.log('Razorpay Key ID:', razorpayKeyId ? 'Present' : 'Missing');
            console.log('Razorpay Key ID value:', razorpayKeyId);
            
            if (!razorpayKeyId) {
                toast.error('Payment gateway configuration missing');
                return;
            }
            
            // Validate Razorpay key format
            if (!razorpayKeyId.startsWith('rzp_')) {
                console.error('Invalid Razorpay key format. Key should start with rzp_');
                toast.error('Invalid payment gateway configuration');
                return;
            }
            
            if (razorpayKeyId.includes('test') && !razorpayKeyId.startsWith('rzp_test_')) {
                console.error('Invalid test key format. Test keys should start with rzp_test_');
                toast.error('Invalid test payment configuration');
                return;
            }
            
            // Validate payment order response
            if (!paymentOrder.razorpay_order_id) {
                console.error('Invalid payment order response - missing razorpay_order_id:', paymentOrder);
                toast.error('Invalid payment order response');
                return;
            }

            const options = {
                key: razorpayKeyId,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                name: 'ProtAcc',
                description: `Payment for Order ${paymentOrder.order_number}`,
                order_id: paymentOrder.razorpay_order_id,
                handler: async (response) => {
                    try {
                        console.log('Payment response received:', response);
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        
                        toast.success('Payment successful!');
                        // Refresh the order data to show updated payment status
                        window.location.reload();
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        toast.error('Payment verification failed: ' + (error.message || error.toString()));
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
                        console.log('Payment modal dismissed by user');
                        toast.error('Payment cancelled');
                    },
                    escape: false,
                    confirm_close: true
                },
                timeout: 300, // 5 minutes timeout
                retry: {
                    enabled: true,
                    max_count: 3
                },
                callback_url: window.location.origin + '/orders/' + order.order_number,
                notes: {
                    order_number: paymentOrder.order_number,
                    user_id: order.user_id
                }
            };

            console.log('Opening Razorpay with options:', {
                ...options,
                key: razorpayKeyId + ' (length: ' + razorpayKeyId.length + ')'
            });
            
            try {
                const razorpay = new window.Razorpay(options);
                
                // Add error event listener
                razorpay.on('payment.failed', function (response) {
                    console.error('Razorpay payment failed:', response);
                    console.error('Error code:', response.error.code);
                    console.error('Error description:', response.error.description);
                    console.error('Error source:', response.error.source);
                    console.error('Error step:', response.error.step);
                    console.error('Error reason:', response.error.reason);
                    
                    let errorMessage = 'Payment failed';
                    if (response.error.description) {
                        errorMessage += ': ' + response.error.description;
                    } else if (response.error.reason) {
                        errorMessage += ': ' + response.error.reason;
                    }
                    
                    toast.error(errorMessage);
                });
                
                razorpay.open();
            } catch (razorpayError) {
                console.error('Error creating Razorpay instance:', razorpayError);
                toast.error('Failed to initialize payment gateway: ' + razorpayError.message);
            }
        } catch (error) {
            console.error('Failed to initiate payment:', error);
            toast.error('Failed to initiate payment: ' + (error.message || error.toString()));
        } finally {
            setProcessingPayment(false);
        }
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                console.log('Fetching order details for order number:', orderNumber);
                
                // First fetch the order data
                const orderData = await getOrderByNumber(orderNumber);
                console.log('Order data fetched:', orderData);
                setOrder(orderData);
                
                // Then fetch the order history using the order ID
                console.log('Fetching order history for order ID:', orderData.id);
                const historyData = await getOrderStatusHistory(orderData.id);
                console.log('Order history fetched:', historyData);
                // Ensure historyData is always an array
                setStatusHistory(Array.isArray(historyData) ? historyData : []);
            } catch (error) {
                console.error('Error fetching order details:', error);
                console.error('Error type:', typeof error);
                console.error('Error message:', error.message);
                
                let errorMessage = 'Failed to load order details';
                if (error.message?.includes('Order not found')) {
                    errorMessage = 'Order not found';
                } else if (error.message?.includes('Authorization')) {
                    errorMessage = 'Please log in to view order details';
                } else if (typeof error === 'string') {
                    errorMessage = error;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                toast.error(errorMessage);
                // Ensure statusHistory is always an array even on error
                setStatusHistory([]);
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderNumber, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-header-safe">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-lg text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-header-safe">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-header-safe pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FaArrowLeft className="text-xl" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                        Order #{order.order_number}
                                    </h2>
                                    <p className="text-gray-600">
                                        Placed on {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Service Details ({order.items?.length || 0} service{order.items?.length !== 1 ? 's' : ''})
                                </h3>
                                <div className="space-y-6">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                            <div key={item.id || index} className="border border-gray-100 rounded-lg p-4">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FaFileAlt className="text-indigo-600 mt-1" />
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {item.service?.name || 'Unknown Service'}
                                                                </p>
                                                                <p className="text-gray-600">
                                                                    {item.service?.short_description || ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">Price</p>
                                                            <p className="font-medium text-gray-900">₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                    {item.service.estimated_delivery_days > 0 && (
                                                        <div className="flex items-center gap-3">
                                                            <FaClock className="text-indigo-600" />
                                                            <div>
                                                                <p className="font-medium text-gray-900">Estimated Delivery</p>
                                                                <p className="text-gray-600">{item.service.estimated_delivery_days} days</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-center py-4">
                                            No services found for this order
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status History */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
                            <div className="space-y-8">
                                {statusHistory && statusHistory.length > 0 ? (
                                    statusHistory.map((history, index) => (
                                        <div key={history.id} className="relative">
                                            {index !== statusHistory.length - 1 && (
                                                <div className="absolute top-8 left-4 bottom-0 w-0.5 bg-gray-200" />
                                            )}
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                                </div>
                                                <div>
                                                    <OrderStatusBadge status={history.status} />
                                                    {history.notes && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {history.notes}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(history.created_at).toLocaleString()}
                                                        {history.user && (
                                                            <> by {history.user.first_name} {history.user.last_name}</>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-center py-4">
                                        No status history available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Total Service Amount</span>
                                    <span className="text-gray-900 font-medium">₹{order.total_amount}</span>
                                </div>
                                
                                {/* Show different payment breakdown based on status */}
                                {order.status === 'full_payment_received' || order.remaining_amount === 0 ? (
                                    // Full payment completed
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Amount Paid</span>
                                        <span className="text-green-600 font-medium">₹{order.total_amount}</span>
                                    </div>
                                ) : order.status === 'pending_booking_payment' ? (
                                    // No payment made yet
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Amount Due</span>
                                        <span className="text-orange-600 font-medium">₹{order.total_amount}</span>
                                    </div>
                                ) : (
                                    // Partial payment made (booking amount received)
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Amount Paid</span>
                                            <span className="text-green-600 font-medium">₹{order.booking_amount}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Remaining Amount</span>
                                            <span className="text-orange-600 font-medium">₹{order.remaining_amount}</span>
                                        </div>
                                    </>
                                )}
                                
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`font-medium ${
                                            order.status === 'full_payment_received' || order.remaining_amount === 0 
                                                ? 'text-green-600' 
                                                : order.status === 'booking_amount_received' 
                                                ? 'text-blue-600' 
                                                : order.status === 'pending_booking_payment'
                                                ? 'text-red-600'
                                                : 'text-yellow-600'
                                        }`}>
                                            {order.status === 'full_payment_received' || order.remaining_amount === 0 
                                                ? 'Fully Paid' 
                                                : order.status === 'booking_amount_received' 
                                                ? 'Partially Paid' 
                                                : order.status === 'pending_booking_payment'
                                                ? 'Payment Required'
                                                : 'Pending Payment'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(order.status === 'pending_booking_payment' || order.status === 'pending_final_payment') && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 text-yellow-600 mb-4">
                                    <FaMoneyBillWave className="text-xl" />
                                    <h3 className="text-lg font-semibold">
                                        {order.status === 'pending_booking_payment' ? 'Booking Payment Required' : 'Final Payment Required'}
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {order.status === 'pending_booking_payment' 
                                        ? 'Please pay the booking amount to start processing your order.'
                                        : 'Please pay the remaining amount to complete your order.'
                                    }
                                </p>
                                <button
                                    onClick={handlePayment}
                                    disabled={processingPayment}
                                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {processingPayment ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaMoneyBillWave className="mr-2" />
                                            {order.status === 'pending_booking_payment' 
                                                ? `Pay Booking Amount (₹${order.booking_amount})`
                                                : `Pay Remaining Amount (₹${order.remaining_amount})`
                                            }
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage; 