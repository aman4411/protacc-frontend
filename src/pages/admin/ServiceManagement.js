import React, { useState, useEffect } from 'react';
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaSpinner, 
    FaEye,
    FaSearch,
    FaFilter,
    FaTag,
    FaServicestack,
    FaToggleOn,
    FaToggleOff,
    FaArrowUp,
    FaArrowDown,
    FaSortNumericDown
} from 'react-icons/fa';
import { 
    getAdminServices, 
    getAdminCategories, 
    createService, 
    updateService, 
    deleteService,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryPriority,
    updateServicePriority
} from '../../services/api';
import toast from 'react-hot-toast';

const ServiceManagement = () => {
    const [activeTab, setActiveTab] = useState('services');
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
    const [modalEntity, setModalEntity] = useState('service'); // 'service', 'category'
    const [selectedItem, setSelectedItem] = useState(null);
    const [processing, setProcessing] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        status: ''
    });

    // Form data
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'services') {
                const servicesData = await getAdminServices();
                setServices(Array.isArray(servicesData) ? servicesData : []);
            }
            const categoriesData = await getAdminCategories();
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type, entity, item = null) => {
        setModalType(type);
        setModalEntity(entity);
        setSelectedItem(item);
        
        if (entity === 'service') {
            setFormData(item ? {
                ...item,
                features: Array.isArray(item.features) ? item.features.join('\n') : '',
                requirements: Array.isArray(item.requirements) ? item.requirements.join('\n') : '',
                suited_for: Array.isArray(item.suited_for) ? item.suited_for.join('\n') : '',
                whats_included: Array.isArray(item.whats_included) ? item.whats_included.join('\n') : ''
            } : {
                name: '',
                slug: '',
                description: '',
                short_description: '',
                features: '',
                requirements: '',
                suited_for: '',
                whats_included: '',
                price: '',
                booking_amount: '',
                estimated_delivery_days: '',
                category_id: '',
                status: 'active'
            });
        } else {
            setFormData(item || {
                name: '',
                slug: '',
                description: '',
                icon: '',
                status: 'active'
            });
        }
        
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setFormData({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            let result;
            const submitData = { ...formData };
            
            if (modalEntity === 'service') {
                // Convert features, requirements, and suited_for back to arrays
                submitData.features = submitData.features.split('\n').filter(f => f.trim());
                submitData.requirements = submitData.requirements.split('\n').filter(r => r.trim());
                submitData.suited_for = (submitData.suited_for || '').split('\n').filter(s => s.trim());
                submitData.whats_included = (submitData.whats_included || '').split('\n').filter(w => w.trim());
                submitData.price = parseFloat(submitData.price) || 0;
                submitData.booking_amount = parseFloat(submitData.booking_amount) || 0;
                submitData.estimated_delivery_days = parseInt(submitData.estimated_delivery_days) || 0;
                submitData.category_id = parseInt(submitData.category_id) || 0;

                if (modalType === 'create') {
                    result = await createService(submitData);
                    toast.success('Service created successfully');
                } else {
                    result = await updateService(selectedItem.id, submitData);
                    toast.success('Service updated successfully');
                }
            } else {
                if (modalType === 'create') {
                    result = await createCategory(submitData);
                    toast.success('Category created successfully');
                } else {
                    result = await updateCategory(selectedItem.id, submitData);
                    toast.success('Category updated successfully');
                }
            }

            handleCloseModal();
            fetchData();
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (entity, id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            if (entity === 'service') {
                await deleteService(id);
                toast.success('Service deleted successfully');
            } else {
                await deleteCategory(id);
                toast.success('Category deleted successfully');
            }
            fetchData();
        } catch (error) {
            toast.error(error.toString());
        }
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = !filters.search || 
            service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            service.description.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = !filters.category || 
            service.category_id.toString() === filters.category;
        const matchesStatus = !filters.status || service.status === filters.status;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const filteredCategories = categories.filter(category => {
        const matchesSearch = !filters.search || 
            category.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStatus = !filters.status || category.status === filters.status;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
                <p className="text-gray-600">Manage services and categories</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'services'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <FaServicestack className="inline mr-2" />
                        Services ({services.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'categories'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <FaTag className="inline mr-2" />
                        Categories ({categories.length})
                    </button>
                </nav>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        {activeTab === 'services' && (
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            onClick={() => handleOpenModal('create', activeTab === 'services' ? 'service' : 'category')}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <FaPlus />
                            Add {activeTab === 'services' ? 'Service' : 'Category'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {activeTab === 'services' ? (
                        <ServicesTable 
                            services={filteredServices}
                            categories={categories}
                            onEdit={(service) => handleOpenModal('edit', 'service', service)}
                            onView={(service) => handleOpenModal('view', 'service', service)}
                            onDelete={(service) => handleDelete('service', service.id, service.name)}
                        />
                    ) : (
                        <CategoriesTable 
                            categories={filteredCategories}
                            onEdit={(category) => handleOpenModal('edit', 'category', category)}
                            onView={(category) => handleOpenModal('view', 'category', category)}
                            onDelete={(category) => handleDelete('category', category.id, category.name)}
                        />
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <Modal
                    type={modalType}
                    entity={modalEntity}
                    item={selectedItem}
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                    processing={processing}
                />
            )}
        </div>
    );
};

// Services Table Component
const ServicesTable = ({ services, categories, onEdit, onView, onDelete }) => {
    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                    <div className="text-sm text-gray-500 line-clamp-2">{service.short_description}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {getCategoryName(service.category_id)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">₹{service.price}</div>
                                <div className="text-xs text-gray-500">Booking: ₹{service.booking_amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    service.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {service.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onView(service)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => onEdit(service)}
                                        className="text-yellow-600 hover:text-yellow-900"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onDelete(service)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {services.length === 0 && (
                <div className="text-center py-12">
                    <FaServicestack className="mx-auto text-4xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                    <p className="text-gray-500">Get started by creating your first service.</p>
                </div>
            )}
        </div>
    );
};

// Categories Table Component
const CategoriesTable = ({ categories, onEdit, onView, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
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
                    {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    {category.icon && (
                                        <img 
                                            src={category.icon} 
                                            alt={category.name}
                                            className="h-8 w-8 mr-3"
                                            onError={(e) => {e.target.style.display = 'none'}}
                                        />
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        <div className="text-sm text-gray-500">{category.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {category.slug}
                                </code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    category.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {category.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(category.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onView(category)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => onEdit(category)}
                                        className="text-yellow-600 hover:text-yellow-900"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => onDelete(category)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {categories.length === 0 && (
                <div className="text-center py-12">
                    <FaTag className="mx-auto text-4xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-500">Get started by creating your first category.</p>
                </div>
            )}
        </div>
    );
};

// Modal Component
const Modal = ({ type, entity, item, formData, setFormData, categories, onSubmit, onClose, processing }) => {
    const isReadOnly = type === 'view';
    const title = `${type.charAt(0).toUpperCase() + type.slice(1)} ${entity.charAt(0).toUpperCase() + entity.slice(1)}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {entity === 'service' ? (
                        <ServiceForm
                            formData={formData}
                            setFormData={setFormData}
                            categories={categories}
                            isReadOnly={isReadOnly}
                        />
                    ) : (
                        <CategoryForm
                            formData={formData}
                            setFormData={setFormData}
                            isReadOnly={isReadOnly}
                        />
                    )}

                    {!isReadOnly && (
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
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {processing && <FaSpinner className="animate-spin" />}
                                {type === 'create' ? 'Create' : 'Update'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// Service Form Component
const ServiceForm = ({ formData, setFormData, categories, isReadOnly }) => {
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        readOnly={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={formData.category_id || ''}
                        onChange={(e) => handleChange('category_id', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                    type="text"
                    value={formData.short_description || ''}
                    onChange={(e) => handleChange('short_description', e.target.value)}
                    readOnly={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    readOnly={isReadOnly}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        readOnly={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Amount (₹)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.booking_amount || ''}
                        onChange={(e) => handleChange('booking_amount', e.target.value)}
                        readOnly={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Days</label>
                    <input
                        type="number"
                        value={formData.estimated_delivery_days || ''}
                        onChange={(e) => handleChange('estimated_delivery_days', e.target.value)}
                        readOnly={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                    value={formData.features || ''}
                    onChange={(e) => handleChange('features', e.target.value)}
                    readOnly={isReadOnly}
                    rows={4}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                <textarea
                    value={formData.requirements || ''}
                    onChange={(e) => handleChange('requirements', e.target.value)}
                    readOnly={isReadOnly}
                    rows={4}
                    placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suited For (one per line)</label>
                <textarea
                    value={formData.suited_for || ''}
                    onChange={(e) => handleChange('suited_for', e.target.value)}
                    readOnly={isReadOnly}
                    rows={4}
                    placeholder="Salaried Individuals&#10;Single & Multiple Employers&#10;Freelancers & Professionals"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What's Included (one per line)</label>
                <textarea
                    value={formData.whats_included || ''}
                    onChange={(e) => handleChange('whats_included', e.target.value)}
                    readOnly={isReadOnly}
                    rows={4}
                    placeholder="Complete documentation&#10;Expert consultation&#10;Follow-up support"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    value={formData.status || 'active'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </>
    );
};

// Category Form Component
const CategoryForm = ({ formData, setFormData, isReadOnly }) => {
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    readOnly={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    readOnly={isReadOnly}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                <input
                    type="url"
                    value={formData.icon || ''}
                    onChange={(e) => handleChange('icon', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="/images/categories/category-name.svg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    value={formData.status || 'active'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </>
    );
};

export default ServiceManagement; 