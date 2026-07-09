import React, { useState, useEffect } from 'react';
import { 
    FaArrowUp, 
    FaArrowDown, 
    FaSpinner,
    FaServicestack,
    FaTag,
} from 'react-icons/fa';
import { 
    getAdminServices, 
    getAdminCategories,
    updateCategoryPriority,
    updateServicePriority
} from '../../services/api';
import toast from 'react-hot-toast';

const PriorityManagement = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [categoriesData, servicesData] = await Promise.all([
                getAdminCategories(),
                getAdminServices()
            ]);
            
            // Sort by priority for display
            setCategories(categoriesData.sort((a, b) => a.priority - b.priority));
            setServices(servicesData.sort((a, b) => a.priority - b.priority));
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePriority = async (type, id, newPriority) => {
        try {
            setUpdating(`${type}-${id}`);
            
            if (type === 'category') {
                await updateCategoryPriority(id, newPriority);
                setCategories(prev => 
                    prev.map(cat => 
                        cat.id === id ? { ...cat, priority: newPriority } : cat
                    ).sort((a, b) => a.priority - b.priority)
                );
                toast.success('Category priority updated');
            } else {
                await updateServicePriority(id, newPriority);
                setServices(prev => 
                    prev.map(svc => 
                        svc.id === id ? { ...svc, priority: newPriority } : svc
                    ).sort((a, b) => a.priority - b.priority)
                );
                toast.success('Service priority updated');
            }
        } catch (error) {
            toast.error(`Failed to update ${type} priority`);
            console.error('Error updating priority:', error);
        } finally {
            setUpdating(null);
        }
    };

    const movePriority = async (type, id, currentPriority, direction) => {
        const newPriority = direction === 'up' ? currentPriority - 15 : currentPriority + 15;
        await updatePriority(type, id, Math.max(0, newPriority));
    };

    const handlePriorityInputChange = async (type, id, value) => {
        const priority = parseInt(value) || 0;
        await updatePriority(type, id, priority);
    };

    const PriorityItem = ({ item, type }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    {type === 'service' && item.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                            {item.category.name}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                    {/* Priority Input */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Priority:</label>
                        <input
                            type="number"
                            value={item.priority}
                            onChange={(e) => handlePriorityInputChange(type, item.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                            disabled={updating === `${type}-${item.id}`}
                        />
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => movePriority(type, item.id, item.priority, 'up')}
                            disabled={updating === `${type}-${item.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Move up (higher priority)"
                        >
                            {updating === `${type}-${item.id}` ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaArrowUp />
                            )}
                        </button>
                        <button
                            onClick={() => movePriority(type, item.id, item.priority, 'down')}
                            disabled={updating === `${type}-${item.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Move down (lower priority)"
                        >
                            <FaArrowDown />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Priority Management</h2>
                <p className="text-gray-600">Control the display order of categories and services on your website</p>
                <div className="mt-2 text-sm text-gray-500">
                    <strong>Lower numbers = Higher priority</strong> (items with priority 0 appear first)
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
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
                </nav>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'categories' ? (
                    categories.length > 0 ? (
                        categories.map((category) => (
                            <PriorityItem 
                                key={category.id} 
                                item={category} 
                                type="category" 
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <FaTag className="mx-auto text-4xl mb-4" />
                            <p>No categories found</p>
                        </div>
                    )
                ) : (
                    services.length > 0 ? (
                        services.map((service) => (
                            <PriorityItem 
                                key={service.id} 
                                item={service} 
                                type="service" 
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <FaServicestack className="mx-auto text-4xl mb-4" />
                            <p>No services found</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default PriorityManagement; 