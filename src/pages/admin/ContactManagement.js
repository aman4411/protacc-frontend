import React, { useState, useEffect } from 'react';
import { 
    FaEnvelope, 
    FaPhone, 
    FaUser, 
    FaBuilding, 
    FaCalendarAlt,
    FaEye,
    FaEdit,
    FaTrash,
    FaFilter,
    FaSearch,
    FaTimes,
    FaReply,
    FaCheckCircle,
    FaClock,
    FaChevronLeft,
    FaChevronRight,
    FaWhatsapp,
    FaComment,
    FaUserTie,
    FaGlobe
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { 
    getContacts, 
    getContactById, 
    updateContactStatus, 
    deleteContact,
    getContactStats 
} from '../../services/api';

const ContactManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Filters and pagination
    const [filters, setFilters] = useState({
        status: '',
        service_interest: '',
        date_from: '',
        date_to: '',
        search: '',
        page: 1,
        limit: 10
    });
    
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        has_next: false,
        has_previous: false
    });

    // Fetch contacts
    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await getContacts(filters);
            setContacts(response.contacts || []);
            setPagination(response.pagination || {});
        } catch (error) {
            toast.error('Failed to fetch contacts');
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch contact statistics
    const fetchStats = async () => {
        try {
            const response = await getContactStats();
            setStats(response.stats || {});
        } catch (error) {
            console.error('Error fetching contact stats:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filtering
        }));
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            status: '',
            service_interest: '',
            date_from: '',
            date_to: '',
            search: '',
            page: 1,
            limit: 10
        });
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // View contact details
    const handleViewDetails = async (contactId) => {
        try {
            const response = await getContactById(contactId);
            setSelectedContact(response.contact);
            setShowDetailsModal(true);
        } catch (error) {
            toast.error('Failed to fetch contact details');
        }
    };

    // Update contact status
    const handleStatusUpdate = async (contactId, status) => {
        try {
            setActionLoading(true);
            await updateContactStatus(contactId, { status });
            toast.success(`Contact marked as ${status}`);
            
            // Refresh contacts and stats
            await fetchContacts();
            await fetchStats();
            
            // Update selected contact if it's open
            if (selectedContact && selectedContact.id === contactId) {
                const response = await getContactById(contactId);
                setSelectedContact(response.contact);
            }
        } catch (error) {
            toast.error('Failed to update contact status');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete contact
    const handleDelete = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact message?')) {
            return;
        }

        try {
            setActionLoading(true);
            await deleteContact(contactId);
            toast.success('Contact deleted successfully');
            
            // Refresh contacts and stats
            await fetchContacts();
            await fetchStats();
            
            // Close modal if deleted contact was open
            if (selectedContact && selectedContact.id === contactId) {
                setShowDetailsModal(false);
                setSelectedContact(null);
            }
        } catch (error) {
            toast.error('Failed to delete contact');
        } finally {
            setActionLoading(false);
        }
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-100 text-blue-800 border-blue-200',
            replied: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            resolved: 'bg-green-100 text-green-800 border-green-200'
        };
        
        const icons = {
            new: FaClock,
            replied: FaReply,
            resolved: FaCheckCircle
        };
        
        const Icon = icons[status] || FaClock;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.new}`}>
                <Icon className="mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get contact method icon
    const getContactMethodIcon = (method) => {
        const icons = {
            email: FaEnvelope,
            phone: FaPhone,
            whatsapp: FaWhatsapp
        };
        return icons[method] || FaEnvelope;
    };

    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
                            <p className="text-gray-600">Manage customer inquiries and contact messages</p>
                        </div>
                        
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <FaFilter className="mr-2" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_messages || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaEnvelope className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New Messages</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.new_messages || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaClock className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Replied</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.replied_messages || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FaReply className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Resolved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.resolved_messages || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaCheckCircle className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search name, email, subject..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="new">New</option>
                                    <option value="replied">Replied</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Interest</label>
                                <select
                                    value={filters.service_interest}
                                    onChange={(e) => handleFilterChange('service_interest', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Services</option>
                                    <option value="Business Registration">Business Registration</option>
                                    <option value="Tax Compliance">Tax Compliance</option>
                                    <option value="Trademark & IP">Trademark & IP</option>
                                    <option value="Digital Services">Digital Services</option>
                                    <option value="Legal Notice Handling">Legal Notice Handling</option>
                                    <option value="Bookkeeping Services">Bookkeeping Services</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contacts Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Contact Messages</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Showing {contacts.length} of {pagination.total_count} contacts
                        </p>
                    </div>
                    
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="text-gray-500 mt-2">Loading contacts...</p>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="p-12 text-center">
                            <FaEnvelope className="text-gray-400 text-4xl mx-auto mb-4" />
                            <p className="text-gray-500">No contact messages found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contacts.map((contact) => {
                                            const ContactIcon = getContactMethodIcon(contact.preferred_contact);
                                            
                                            return (
                                                <tr key={contact.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                                                    <FaUser className="text-white text-sm" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                                                    {contact.name}
                                                                    <ContactIcon className="ml-2 text-gray-400 text-xs" />
                                                                </div>
                                                                <div className="text-sm text-gray-500">{contact.email}</div>
                                                                {contact.company && (
                                                                    <div className="text-xs text-gray-400 flex items-center mt-1">
                                                                        <FaBuilding className="mr-1" />
                                                                        {contact.company}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 line-clamp-2">{contact.subject}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-700">
                                                            {contact.service_interest || 'Not specified'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(contact.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(contact.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleViewDetails(contact.id)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                                title="View Details"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            
                                                            {contact.status === 'new' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(contact.id, 'replied')}
                                                                    className="text-yellow-600 hover:text-yellow-900"
                                                                    title="Mark as Replied"
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaReply />
                                                                </button>
                                                            )}
                                                            
                                                            {contact.status !== 'resolved' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(contact.id, 'resolved')}
                                                                    className="text-green-600 hover:text-green-900"
                                                                    title="Mark as Resolved"
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaCheckCircle />
                                                                </button>
                                                            )}
                                                            
                                                            <button
                                                                onClick={() => handleDelete(contact.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Delete"
                                                                disabled={actionLoading}
                                                            >
                                                                <FaTrash />
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
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Page {pagination.current_page} of {pagination.total_pages}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={!pagination.has_previous}
                                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={!pagination.has_next}
                                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Contact Details Modal */}
                {showDetailsModal && selectedContact && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" onClick={() => setShowDetailsModal(false)}>
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Contact Details</h3>
                                        <p className="text-gray-500 mt-1">ID: {selectedContact.id}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Contact Information */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FaUser className="mr-2" />
                                                Contact Information
                                            </h4>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <FaUser className="text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Name</p>
                                                        <p className="font-medium">{selectedContact.name}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <FaEnvelope className="text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email</p>
                                                        <p className="font-medium">{selectedContact.email}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <FaPhone className="text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Phone</p>
                                                        <p className="font-medium">{selectedContact.phone}</p>
                                                    </div>
                                                </div>
                                                
                                                {selectedContact.company && (
                                                    <div className="flex items-center">
                                                        <FaBuilding className="text-gray-400 mr-3" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Company</p>
                                                            <p className="font-medium">{selectedContact.company}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center">
                                                    <FaGlobe className="text-gray-400 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Preferred Contact</p>
                                                        <div className="flex items-center">
                                                            {React.createElement(getContactMethodIcon(selectedContact.preferred_contact), { className: "mr-2" })}
                                                            <span className="font-medium capitalize">{selectedContact.preferred_contact}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FaEdit className="mr-2" />
                                                Status & Actions
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">Current Status</p>
                                                    {getStatusBadge(selectedContact.status)}
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedContact.status !== 'replied' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(selectedContact.id, 'replied')}
                                                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm flex items-center"
                                                            disabled={actionLoading}
                                                        >
                                                            <FaReply className="mr-1" />
                                                            Mark as Replied
                                                        </button>
                                                    )}
                                                    
                                                    {selectedContact.status !== 'resolved' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(selectedContact.id, 'resolved')}
                                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm flex items-center"
                                                            disabled={actionLoading}
                                                        >
                                                            <FaCheckCircle className="mr-1" />
                                                            Mark as Resolved
                                                        </button>
                                                    )}
                                                    
                                                    {selectedContact.status !== 'new' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(selectedContact.id, 'new')}
                                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center"
                                                            disabled={actionLoading}
                                                        >
                                                            <FaClock className="mr-1" />
                                                            Mark as New
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Details */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FaComment className="mr-2" />
                                                Message Details
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                {selectedContact.service_interest && (
                                                    <div>
                                                        <p className="text-sm text-gray-500">Service Interest</p>
                                                        <p className="font-medium">{selectedContact.service_interest}</p>
                                                    </div>
                                                )}
                                                
                                                <div>
                                                    <p className="text-sm text-gray-500">Subject</p>
                                                    <p className="font-medium">{selectedContact.subject}</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-2">Message</p>
                                                    <div className="bg-white p-3 rounded border">
                                                        <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Metadata */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <FaCalendarAlt className="mr-2" />
                                                Metadata
                                            </h4>
                                            
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Created:</span>
                                                    <span className="font-medium">{formatDate(selectedContact.created_at)}</span>
                                                </div>
                                                
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Updated:</span>
                                                    <span className="font-medium">{formatDate(selectedContact.updated_at)}</span>
                                                </div>
                                                
                                                {selectedContact.responded_at && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Responded:</span>
                                                        <span className="font-medium">{formatDate(selectedContact.responded_at)}</span>
                                                    </div>
                                                )}
                                                
                                                {selectedContact.responded_by && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Responded by:</span>
                                                        <span className="font-medium flex items-center">
                                                            <FaUserTie className="mr-1" />
                                                            {selectedContact.responded_by}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {selectedContact.ip_address && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">IP Address:</span>
                                                        <span className="font-medium font-mono text-xs">{selectedContact.ip_address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedContact.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                        disabled={actionLoading}
                                    >
                                        <FaTrash className="mr-2" />
                                        Delete Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManagement; 