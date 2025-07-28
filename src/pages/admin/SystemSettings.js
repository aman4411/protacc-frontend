import React, { useState, useEffect } from 'react';
import { 
    FaCog, 
    FaEnvelope, 
    FaCreditCard, 
    FaBell, 
    FaShieldAlt, 
    FaBriefcase, 
    FaPalette, 
    FaSearch,
    FaSpinner,
    FaSave,
    FaUndo,
    FaPlus,
    FaTrash,
    FaCheck,
    FaTimes,
    FaEdit,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import { 
    getSettingsByCategory,
    updateMultipleSettings,
    testEmailSettings,
    resetSettingsToDefaults
} from '../../services/api';
import toast from 'react-hot-toast';

const SystemSettings = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changes, setChanges] = useState({});
    const [showPasswords, setShowPasswords] = useState({});

    const categoryIcons = {
        general: FaCog,
        email: FaEnvelope,
        payment: FaCreditCard,
        notification: FaBell,
        security: FaShieldAlt,
        business: FaBriefcase,
        ui: FaPalette,
        seo: FaSearch
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await getSettingsByCategory();
            setCategories(Array.isArray(data) ? data : []);
            if (data.length > 0 && !data.find(cat => cat.name === activeCategory)) {
                setActiveCategory(data[0].name);
            }
        } catch (error) {
            toast.error('Failed to fetch settings');
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (category, settingKey, value) => {
        const changeKey = `${category}.${settingKey}`;
        setChanges(prev => ({
            ...prev,
            [changeKey]: { category, setting_key: settingKey, setting_value: value }
        }));
    };

    const handleSaveChanges = async () => {
        if (Object.keys(changes).length === 0) {
            toast.info('No changes to save');
            return;
        }

        setSaving(true);
        try {
            const settingsToUpdate = Object.values(changes);
            await updateMultipleSettings(settingsToUpdate);
            toast.success('Settings updated successfully');
            setChanges({});
            fetchSettings(); // Refresh to get updated values
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        setChanges({});
        toast.info('Changes discarded');
    };

    const handleTestEmail = async () => {
        try {
            await testEmailSettings();
            toast.success('Email test initiated (check implementation)');
        } catch (error) {
            toast.error(error.toString());
        }
    };

    const handleResetCategory = async (categoryName) => {
        if (!window.confirm(`Are you sure you want to reset all ${categoryName} settings to their default values?`)) {
            return;
        }

        try {
            await resetSettingsToDefaults(categoryName);
            toast.success(`${categoryName} settings reset to defaults`);
            fetchSettings();
        } catch (error) {
            toast.error(error.toString());
        }
    };

    const getSettingValue = (category, settingKey) => {
        const changeKey = `${category}.${settingKey}`;
        if (changes[changeKey]) {
            return changes[changeKey].setting_value;
        }
        
        const categoryData = categories.find(cat => cat.name === category);
        if (categoryData) {
            const setting = categoryData.settings.find(s => s.setting_key === settingKey);
            return setting ? setting.setting_value : '';
        }
        return '';
    };

    const renderSettingInput = (setting) => {
        const value = getSettingValue(setting.category, setting.setting_key);
        const isPassword = setting.setting_key.toLowerCase().includes('password') || 
                          setting.setting_key.toLowerCase().includes('secret');
        const showPassword = showPasswords[`${setting.category}.${setting.setting_key}`];

        switch (setting.data_type) {
            case 'boolean':
                return (
                    <div className="flex items-center">
                        <button
                            onClick={() => handleSettingChange(setting.category, setting.setting_key, value === 'true' ? 'false' : 'true')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                value === 'true' ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    value === 'true' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className="ml-3 text-sm text-gray-700">
                            {value === 'true' ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleSettingChange(setting.category, setting.setting_key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                );

            case 'json':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleSettingChange(setting.category, setting.setting_key, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                        placeholder="Enter valid JSON"
                    />
                );

            default:
                return (
                    <div className="relative">
                        <input
                            type={isPassword && !showPassword ? 'password' : 'text'}
                            value={value}
                            onChange={(e) => handleSettingChange(setting.category, setting.setting_key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({
                                    ...prev,
                                    [`${setting.category}.${setting.setting_key}`]: !prev[`${setting.category}.${setting.setting_key}`]
                                }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        )}
                    </div>
                );
        }
    };

    const hasChanges = Object.keys(changes).length > 0;
    const activeData = categories.find(cat => cat.name === activeCategory);

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                    <span className="ml-2 text-gray-600">Loading settings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                <p className="text-gray-600">Configure application settings and preferences</p>
            </div>

            {/* Save/Discard Bar */}
            {hasChanges && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaEdit className="text-yellow-600 mr-2" />
                            <span className="text-yellow-800 font-medium">
                                You have {Object.keys(changes).length} unsaved change(s)
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDiscardChanges}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <FaUndo className="inline mr-2" />
                                Discard
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Category Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                        <nav className="space-y-2">
                            {categories.map((category) => {
                                const Icon = categoryIcons[category.name] || FaCog;
                                const isActive = activeCategory === category.name;
                                
                                return (
                                    <button
                                        key={category.name}
                                        onClick={() => setActiveCategory(category.name)}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon className="mr-3" />
                                        <span>{category.display_name}</span>
                                        <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                            {category.settings.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm">
                        {activeData && (
                            <>
                                {/* Category Header */}
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {activeData.display_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {activeData.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activeCategory === 'email' && (
                                                <button
                                                    onClick={handleTestEmail}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                >
                                                    Test Email
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleResetCategory(activeCategory)}
                                                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                Reset to Defaults
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Settings List */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {activeData.settings.map((setting) => (
                                            <div key={setting.setting_key} className="border-b border-gray-100 pb-6 last:border-b-0">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </label>
                                                        {setting.description && (
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                {setting.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <span className="px-2 py-1 bg-gray-100 rounded">
                                                                {setting.data_type}
                                                            </span>
                                                            {setting.is_public && (
                                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                                                    Public
                                                                </span>
                                                            )}
                                                            {setting.is_encrypted && (
                                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                                                    Encrypted
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {renderSettingInput(setting)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings; 