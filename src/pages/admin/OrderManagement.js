import React, { useState, useEffect } from 'react';
import { 
    FaSearch, 
    FaFilter, 
    FaEye,
    FaEdit, 
    FaSpinner, 
    FaChevronLeft, 
    FaChevronRight,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaUser,
    FaDollarSign,
    FaClipboardList,
    FaHistory,
    FaSync
} from 'react-icons/fa';
import { 
    getAdminOrders, 
    updateOrderStatus,
    getOrderStatusHistory
} from '../../services/api';
import toast from 'react-hot-toast';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('view'); // 'view', 'status', 'history'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    
    // Pagination and filters
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        total_pages: 0
    });
    
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        page: 1,
        limit: 10
    });

    // Status update form
    const [statusForm, setStatusForm] = useState({
        status: '',
        notes: ''
    });

    const orderStatuses = [
        { value: 'pending_booking_payment', label: 'Pending Booking Payment', color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
        { value: 'booking_amount_received', label: 'Booking Amount Received', color: 'bg-blue-100 text-blue-800', icon: FaDollarSign },
        { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: FaSpinner },
        { value: 'documents_required', label: 'Documents Required', color: 'bg-orange-100 text-orange-800', icon: FaExclamationTriangle },
        { value: 'documents_received', label: 'Documents Received', color: 'bg-indigo-100 text-indigo-800', icon: FaClipboardList },
        { value: 'in_progress', label: 'In Progress', color: 'bg-cyan-100 text-cyan-800', icon: FaClock },
        { value: 'pending_final_payment', label: 'Pending Final Payment', color: 'bg-amber-100 text-amber-800', icon: FaDollarSign },
        { value: 'full_payment_received', label: 'Full Payment Received', color: 'bg-emerald-100 text-emerald-800', icon: FaCheckCircle },
        { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: FaTimesCircle }
    ];

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await getAdminOrders(filters);
            setOrders(response.orders || []);
            setPagination(response.pagination || {});
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleOpenModal = async (type, order) => {
        setModalType(type);
        setSelectedOrder(order);
        
        if (type === 'status') {
            setStatusForm({
                status: order.status,
                notes: ''
            });
        } else if (type === 'history') {
            try {
                const history = await getOrderStatusHistory(order.id);
                setStatusHistory(history || []);
            } catch (error) {
                toast.error('Failed to fetch order history');
                setStatusHistory([]);
            }
        }
        
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setStatusForm({ status: '', notes: '' });
        setStatusHistory([]);
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        if (!selectedOrder) return;

        setUpdating(selectedOrder.id);
        try {
            await updateOrderStatus(selectedOrder.id, statusForm.status, statusForm.notes);
            toast.success('Order status updated successfully');
            handleCloseModal();
            fetchOrders();
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setUpdating(null);
        }
    };

    const getStatusConfig = (status) => {
        return orderStatuses.find(s => s.value === status) || 
               { value: status, label: status, color: 'bg-gray-100 text-gray-800', icon: FaClock };
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            page: 1,
            limit: 10
        });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                    <p className="text-gray-600">Monitor and manage all customer orders</p>
                </div>
                <button
                    onClick={() => {
                        toast.loading('Refreshing orders...', { id: 'refresh' });
                        fetchOrders().finally(() => toast.dismiss('refresh'));
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FaSync className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by order number, customer name, or email..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Status</option>
                            {orderStatuses.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        
                        <select
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                        </select>

                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                        <span className="ml-2 text-gray-600">Loading orders...</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => {
                                        const statusConfig = getStatusConfig(order.status);
                                        const StatusIcon = statusConfig.icon;
                                        
                                        return (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {order.order_number}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.items?.length || 0} item(s)
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <FaUser className="text-gray-600 text-sm" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {order.user?.first_name} {order.user?.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {order.user?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <span className="font-medium">₹{order.total_amount}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {order.status === 'full_payment_received' || order.remaining_amount === 0 ? (
                                                            <span className="text-green-600">Fully Paid: ₹{order.total_amount}</span>
                                                        ) : order.status === 'pending_booking_payment' ? (
                                                            <span className="text-red-600">Payment Required: ₹{order.total_amount}</span>
                                                        ) : (
                                                            <>Paid: ₹{order.booking_amount} | Pending: ₹{order.remaining_amount}</>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <StatusIcon className="text-gray-500 mr-2" />
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig.color}`}>
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleOpenModal('view', order)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="View Details"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenModal('status', order)}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                            title="Update Status"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenModal('history', order)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="View History"
                                                        >
                                                            <FaHistory />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.total_pages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page <= 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page >= pagination.total_pages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                                            </span> of{' '}
                                            <span className="font-medium">{pagination.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                                disabled={pagination.current_page <= 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            
                                            {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                                                let page;
                                                if (pagination.total_pages <= 5) {
                                                    page = i + 1;
                                                } else if (pagination.current_page <= 3) {
                                                    page = i + 1;
                                                } else if (pagination.current_page >= pagination.total_pages - 2) {
                                                    page = pagination.total_pages - 4 + i;
                                                } else {
                                                    page = pagination.current_page - 2 + i;
                                                }
                                                
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            page === pagination.current_page
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            
                                            <button
                                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                                disabled={pagination.current_page >= pagination.total_pages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && orders.length === 0 && (
                    <div className="text-center py-12">
                        <FaClipboardList className="mx-auto text-4xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedOrder && (
                <OrderModal
                    type={modalType}
                    order={selectedOrder}
                    statusForm={statusForm}
                    setStatusForm={setStatusForm}
                    statusHistory={statusHistory}
                    orderStatuses={orderStatuses}
                    onSubmit={handleStatusUpdate}
                    onClose={handleCloseModal}
                    updating={updating}
                />
            )}
        </div>
    );
};

// Order Modal Component
const OrderModal = ({ 
    type, 
    order, 
    statusForm, 
    setStatusForm, 
    statusHistory, 
    orderStatuses, 
    onSubmit, 
    onClose, 
    updating 
}) => {
    const getTitle = () => {
        switch (type) {
            case 'view': return 'Order Details';
            case 'status': return 'Update Order Status';
            case 'history': return 'Order Status History';
            default: return 'Order';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-medium">{getTitle()}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {type === 'view' && <OrderDetailsView order={order} />}
                    {type === 'status' && (
                        <StatusUpdateForm 
                            statusForm={statusForm}
                            setStatusForm={setStatusForm}
                            orderStatuses={orderStatuses}
                            onSubmit={onSubmit}
                            onClose={onClose}
                            updating={updating}
                        />
                    )}
                    {type === 'history' && <OrderHistoryView history={statusHistory} />}
                </div>
            </div>
        </div>
    );
};

// Order Details View
const OrderDetailsView = ({ order }) => {
    return (
        <div className="space-y-6">
            {/* Order Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-500">Order Number</h4>
                    <p className="mt-1 text-lg font-semibold">{order.order_number}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                    <p className="mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1 capitalize">{order.status.replace('_', ' ')}</p>
                </div>
            </div>

            {/* Customer Details */}
            <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Name:</span>
                            <p className="mt-1">{order.user?.first_name} {order.user?.last_name}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Email:</span>
                            <p className="mt-1">{order.user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{item.service?.name || 'Service'}</div>
                                        <div className="text-sm text-gray-500">{item.service?.short_description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">₹{item.price}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">₹{item.booking_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Summary */}
            <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Payment Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Service Amount:</span>
                            <span className="font-medium">₹{order.total_amount}</span>
                        </div>
                        
                        {/* Show different payment breakdown based on status */}
                        {order.status === 'full_payment_received' || order.remaining_amount === 0 ? (
                            // Full payment completed
                            <div className="flex justify-between border-t pt-2">
                                <span>Amount Paid:</span>
                                <span className="font-medium text-green-600">₹{order.total_amount}</span>
                            </div>
                        ) : order.status === 'pending_booking_payment' ? (
                            // No payment made yet
                            <div className="flex justify-between border-t pt-2">
                                <span>Amount Due:</span>
                                <span className="font-medium text-red-600">₹{order.total_amount}</span>
                            </div>
                        ) : (
                            // Partial payment made (booking amount received)
                            <>
                                <div className="flex justify-between">
                                    <span>Amount Paid:</span>
                                    <span className="font-medium text-green-600">₹{order.booking_amount}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span>Remaining Amount:</span>
                                    <span className="font-medium text-orange-600">₹{order.remaining_amount}</span>
                                </div>
                            </>
                        )}
                        
                        <div className="flex justify-between border-t pt-2 mt-2">
                            <span>Payment Status:</span>
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

            {/* Notes */}
            {order.notes && (
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Notes</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{order.notes}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Status Update Form
const StatusUpdateForm = ({ statusForm, setStatusForm, orderStatuses, onSubmit, onClose, updating }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                >
                    {orderStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                    value={statusForm.notes}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    placeholder="Add any notes about this status change..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {updating && <FaSpinner className="animate-spin" />}
                    Update Status
                </button>
            </div>
        </form>
    );
};

// Order History View
const OrderHistoryView = ({ history }) => {
    return (
        <div className="space-y-4">
            {history.length === 0 ? (
                <div className="text-center py-8">
                    <FaHistory className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">No status history available</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((entry, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FaClock className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 capitalize">
                                        {entry.status.replace('_', ' ')}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                        {new Date(entry.created_at).toLocaleString()}
                                    </span>
                                </div>
                                {entry.notes && (
                                    <p className="mt-1 text-sm text-gray-600">{entry.notes}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Updated by: {entry.created_by}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderManagement; 