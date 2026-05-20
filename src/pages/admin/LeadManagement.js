import React, { useState, useEffect } from 'react';
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaEdit,
    FaTrash,
    FaSpinner,
    FaChevronLeft,
    FaChevronRight,
    FaPhone,
    FaEnvelope,
    FaBuilding,
    FaUser,
    FaTimes,
    FaCalendarAlt,
    FaStickyNote,
    FaChartLine,
    FaUsers,
    FaUserCheck,
    FaDollarSign,
    FaClock,
    FaExclamationTriangle,
    FaCheckCircle,
    FaBan,
    FaSync
} from 'react-icons/fa';
import {
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    getLeadStats,
    getUsers
} from '../../services/api';
import toast from 'react-hot-toast';

const LeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [assignableUsers, setAssignableUsers] = useState([]); // Only admin and staff users
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        assigned_to: '',
        page: 1,
        limit: 10
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    const statusOptions = [
        { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
        { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
        { value: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
        { value: 'converted', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
        { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
        { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
        { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
        { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
        { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
    ];

    useEffect(() => {
        fetchLeads();
        fetchStats();
        fetchUsers();
    }, [filters]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await getLeads(filters);
            setLeads(data.leads || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error fetching leads:', error);
            toast.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await getLeadStats();
            setStats(data.stats || {});
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Helper function to fetch all users of a specific role (handles pagination)
    const fetchAllUsersByRole = async (role) => {
        let allUsers = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
            try {
                const response = await getUsers({ 
                    limit: 100, 
                    role: role, 
                    page: page 
                });
                
                const users = response.users || [];
                allUsers = [...allUsers, ...users];
                
                // Check if there are more pages
                const totalPages = response.pagination?.total_pages || 1;
                hasMore = page < totalPages;
                page++;
                
            } catch (error) {
                console.error(`Error fetching ${role} users on page ${page}:`, error);
                hasMore = false; // Stop on error
            }
        }
        
        return allUsers;
    };

    const fetchUsers = async () => {
        try {
            // Fetch all users for display purposes (if needed elsewhere)
            const allUsersData = await getUsers({ limit: 100 });
            setUsers(allUsersData.users || []);
            
            // Fetch ALL admin and staff users across all pages
            const [adminUsers, staffUsers] = await Promise.all([
                fetchAllUsersByRole('admin'),
                fetchAllUsersByRole('staff')
            ]);
            
            // Combine admin and staff users
            const assignableUsersList = [...adminUsers, ...staffUsers];
            
            // Sort by role (admin first) then by name for better UX
            assignableUsersList.sort((a, b) => {
                if (a.role !== b.role) {
                    return a.role === 'admin' ? -1 : 1; // Admin users first
                }
                return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            });
            
            setAssignableUsers(assignableUsersList);
            
            console.log(`Fetched ${adminUsers.length} admin users and ${staffUsers.length} staff users for lead assignment`);
            
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch assignable users');
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            priority: '',
            assigned_to: '',
            page: 1,
            limit: 10
        });
        setShowFilters(false);
    };

    const handleViewLead = async (leadId) => {
        try {
            const data = await getLeadById(leadId);
            setSelectedLead(data.lead);
            setShowLeadModal(true);
        } catch (error) {
            console.error('Error fetching lead:', error);
            toast.error('Failed to fetch lead details');
        }
    };

    const handleUpdateLead = async (leadId, updates) => {
        try {
            setUpdating(true);
            await updateLead(leadId, updates);
            toast.success('Lead updated successfully');
            
            // Update the lead in local state
            setLeads(prev => prev.map(lead => 
                lead.id === leadId ? { ...lead, ...updates } : lead
            ));
            
            // Update selected lead if it's the one being updated
            if (selectedLead && selectedLead.id === leadId) {
                setSelectedLead(prev => ({ ...prev, ...updates }));
            }
            
            // Refresh stats
            fetchStats();
        } catch (error) {
            console.error('Error updating lead:', error);
            toast.error('Failed to update lead');
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteLead = async (leadId) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) {
            return;
        }

        try {
            await deleteLead(leadId);
            toast.success('Lead deleted successfully');
            setLeads(prev => prev.filter(lead => lead.id !== leadId));
            setShowLeadModal(false);
            fetchStats();
        } catch (error) {
            console.error('Error deleting lead:', error);
            toast.error('Failed to delete lead');
        }
    };

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const priorityOption = priorityOptions.find(option => option.value === priority);
        return priorityOption ? priorityOption.color : 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'new': return <FaClock className="text-blue-500" />;
            case 'contacted': return <FaPhone className="text-yellow-500" />;
            case 'in_progress': return <FaSpinner className="text-purple-500" />;
            case 'qualified': return <FaUserCheck className="text-green-500" />;
            case 'converted': return <FaCheckCircle className="text-emerald-500" />;
            case 'rejected': return <FaBan className="text-red-500" />;
            case 'closed': return <FaTimes className="text-gray-500" />;
            default: return <FaClock className="text-gray-500" />;
        }
    };

    return (
        <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_leads || 0}</p>
                        </div>
                        <FaUsers className="text-2xl text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New Leads</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.new_leads || 0}</p>
                        </div>
                        <FaClock className="text-2xl text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.in_progress_leads || 0}</p>
                        </div>
                        <FaSpinner className="text-2xl text-purple-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Converted</p>
                            <p className="text-2xl font-bold text-green-600">{stats.converted_leads || 0}</p>
                        </div>
                        <FaCheckCircle className="text-2xl text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {stats.conversion_rate ? `${stats.conversion_rate.toFixed(1)}%` : '0%'}
                            </p>
                        </div>
                        <FaChartLine className="text-2xl text-emerald-600" />
                    </div>
                </div>
            </div>

            {/* Header and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0">Lead Management</h1>
                    
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {
                                toast.loading('Refreshing leads...', { id: 'refresh-leads' });
                                Promise.all([fetchLeads(), fetchStats(), fetchUsers()]).finally(() => toast.dismiss('refresh-leads'));
                            }}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaSync className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <FaFilter />
                            Filters
                        </button>
                        
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                value={filters.priority}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">All Priorities</option>
                                {priorityOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                            <select
                                value={filters.assigned_to}
                                onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">All Assignees</option>
                                <option value="unassigned">Unassigned</option>
                                {assignableUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lead Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Business
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned To
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {lead.first_name} {lead.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {lead.id}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div className="flex items-center text-gray-900">
                                                        <FaEnvelope className="mr-1 text-gray-400" />
                                                        {lead.email}
                                                    </div>
                                                    <div className="flex items-center text-gray-500 mt-1">
                                                        <FaPhone className="mr-1 text-gray-400" />
                                                        {lead.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div className="text-gray-900">
                                                        {lead.company_name || 'N/A'}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {lead.business_type || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(lead.status)}
                                                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                                        {lead.status?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                                                    {lead.priority?.toUpperCase()}
                                                </span>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {lead.assigned_user ? (
                                                    <div>
                                                        <div className="font-medium">
                                                            {lead.assigned_user.first_name} {lead.assigned_user.last_name}
                                                        </div>
                                                        <div className="text-gray-500 text-xs">
                                                            {lead.assigned_user.email}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">Unassigned</span>
                                                )}
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(lead.created_at)}
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewLead(lead.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLead(lead.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete Lead"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.pages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{' '}
                                            <span className="font-medium">
                                                {(pagination.page - 1) * pagination.limit + 1}
                                            </span>{' '}
                                            to{' '}
                                            <span className="font-medium">
                                                {Math.min(pagination.page * pagination.limit, pagination.total)}
                                            </span>{' '}
                                            of{' '}
                                            <span className="font-medium">{pagination.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaChevronLeft className="h-5 w-5" />
                                            </button>
                                            
                                            {[...Array(pagination.pages)].map((_, index) => {
                                                const pageNum = index + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            pageNum === pagination.page
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                            
                                            <button
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={pagination.page === pagination.pages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaChevronRight className="h-5 w-5" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}

                        {leads.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No leads match your current filters.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Lead Details Modal */}
            {showLeadModal && selectedLead && (
                <LeadModal
                    lead={selectedLead}
                    onClose={() => {
                        setShowLeadModal(false);
                        setSelectedLead(null);
                    }}
                    onUpdate={(updates) => handleUpdateLead(selectedLead.id, updates)}
                    onDelete={() => handleDeleteLead(selectedLead.id)}
                    updating={updating}
                    users={assignableUsers}
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                />
            )}
        </div>
    );
};

// Lead Details Modal Component
const LeadModal = ({ 
    lead, 
    onClose, 
    onUpdate, 
    onDelete, 
    updating, 
    users, 
    statusOptions, 
    priorityOptions 
}) => {
    const [formData, setFormData] = useState({
        status: lead.status || '',
        priority: lead.priority || '',
        assigned_to: lead.assigned_to || '',
        follow_up_date: lead.follow_up_date ? lead.follow_up_date.split('T')[0] : '',
        notes: lead.notes || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updates = {};
        
        // Only include changed fields
        Object.keys(formData).forEach(key => {
            if (formData[key] !== (lead[key] || '')) {
                if (key === 'assigned_to' && formData[key] === '') {
                    updates[key] = 'null'; // Special handling for unassigning
                } else if (key === 'follow_up_date' && formData[key] === '') {
                    updates[key] = null;
                } else if (formData[key] !== '') {
                    updates[key] = formData[key];
                }
            }
        });

        if (Object.keys(updates).length > 0) {
            onUpdate(updates);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {lead.first_name} {lead.last_name}
                        </h2>
                        <p className="text-indigo-200">Lead ID: {lead.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-indigo-200 transition-colors"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Lead Information */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaUser className="mr-2 text-indigo-600" />
                                    Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaEnvelope className="mr-3 text-gray-400" />
                                        <span className="text-gray-700">{lead.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaPhone className="mr-3 text-gray-400" />
                                        <span className="text-gray-700">{lead.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-3 text-gray-400 font-medium">Preferred Contact:</span>
                                        <span className="text-gray-700 capitalize">
                                            {lead.preferred_contact_method}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaBuilding className="mr-2 text-indigo-600" />
                                    Business Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-600 font-medium">Company:</span>
                                        <span className="ml-2 text-gray-700">
                                            {lead.company_name || 'Not provided'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium">Business Type:</span>
                                        <span className="ml-2 text-gray-700">
                                            {lead.business_type || 'Not provided'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium">Budget Range:</span>
                                        <span className="ml-2 text-gray-700">
                                            {lead.budget_range || 'Not provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Services Interested In
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {lead.services_interested && lead.services_interested.length > 0 ? (
                                        lead.services_interested.map((service, index) => (
                                            <span 
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                            >
                                                {service}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No services specified</span>
                                    )}
                                </div>
                            </div>

                            {lead.message && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Message
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">{lead.message}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Lead Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-600 font-medium">Source:</span>
                                        <span className="ml-2 text-gray-700 capitalize">{lead.source}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium">Created:</span>
                                        <span className="ml-2 text-gray-700">{formatDate(lead.created_at)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 font-medium">Last Updated:</span>
                                        <span className="ml-2 text-gray-700">{formatDate(lead.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Update Form */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FaEdit className="mr-2 text-indigo-600" />
                                Update Lead
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        {priorityOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign To
                                    </label>
                                    <select
                                        name="assigned_to"
                                        value={formData.assigned_to}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.firstName} {user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Follow-up Date
                                    </label>
                                    <input
                                        type="date"
                                        name="follow_up_date"
                                        value={formData.follow_up_date}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Add notes about this lead..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        {updating ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Lead'
                                        )}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={onDelete}
                                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadManagement; 