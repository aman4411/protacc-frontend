import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_PROTACC_API_BASE_URL;

// Log the current environment and API URL
console.log('Current Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('protacc_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add request interceptor for logging
if (process.env.REACT_APP_ENABLE_LOGS === 'true') {
    api.interceptors.request.use(
        (config) => {
            console.log('🚀 API Request:', {
                method: config.method.toUpperCase(),
                url: config.url,
                data: config.data,
            });
            return config;
        },
        (error) => {
            console.error('❌ Request Error:', error);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            console.log('✅ API Response:', {
                status: response.status,
                data: response.data,
            });
            return response;
        },
        (error) => {
            console.error('❌ Response Error:', {
                status: error.response?.status,
                data: error.response?.data,
            });
            return Promise.reject(error);
        }
    );
}

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('protacc_auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const signup = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        const token = response.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new Error('No token received');
        }
        return {
            token,
            user: response.data
        };
    } catch (error) {
        throw error.response?.data?.error || 'An error occurred during signup';
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const token = response.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new Error('No token received');
        }
        return {
            token,
            user: response.data
        };
    } catch (error) {
        throw error.response?.data?.error || 'Invalid email or password';
    }
};

export const verifyEmail = async (verificationData) => {
    try {
        const response = await api.post('/auth/verify-email', verificationData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'An error occurred during email verification';
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch profile';
    }
};

export const getUsers = async (params = {}) => {
    try {
        const response = await api.get('/admin/users', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch users';
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch dashboard stats';
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update user role';
    }
};

export const getAdminOrders = async (params = {}) => {
    try {
        const response = await api.get('/admin/orders', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch orders';
    }
};

export const updateOrderStatus = async (orderId, status, notes = '') => {
    try {
        const response = await api.put(`/admin/orders/${orderId}/status`, { status, notes });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update order status';
    }
};

export const getOrderStatusHistory = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}/history`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch order history';
    }
};

// Admin Service Management
export const getAdminServices = async (params = {}) => {
    try {
        const response = await api.get('/admin/services', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch services';
    }
};

export const createService = async (serviceData) => {
    try {
        const response = await api.post('/admin/services', serviceData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create service';
    }
};

export const updateService = async (serviceId, serviceData) => {
    try {
        const response = await api.put(`/admin/services/${serviceId}`, serviceData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update service';
    }
};

export const deleteService = async (serviceId) => {
    try {
        const response = await api.delete(`/admin/services/${serviceId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete service';
    }
};

// Admin Category Management  
export const getAdminCategories = async () => {
    try {
        const response = await api.get('/admin/categories');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch categories';
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/admin/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create category';
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update category';
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const response = await api.delete(`/admin/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete category';
    }
};

// Admin Settings Management
export const getAllSettings = async () => {
    try {
        const response = await api.get('/admin/settings');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch settings';
    }
};

export const getSettingsByCategory = async () => {
    try {
        const response = await api.get('/admin/settings/categories');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch settings by category';
    }
};

export const getSetting = async (category, key) => {
    try {
        const response = await api.get(`/admin/settings/${category}/${key}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch setting';
    }
};

export const updateSetting = async (category, key, value) => {
    try {
        const response = await api.put(`/admin/settings/${category}/${key}`, { value });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update setting';
    }
};

export const updateMultipleSettings = async (settings) => {
    try {
        const response = await api.put('/admin/settings/bulk', { settings });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update settings';
    }
};

export const createSetting = async (settingData) => {
    try {
        const response = await api.post('/admin/settings', settingData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create setting';
    }
};

export const deleteSetting = async (category, key) => {
    try {
        const response = await api.delete(`/admin/settings/${category}/${key}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete setting';
    }
};

export const testEmailSettings = async () => {
    try {
        const response = await api.post('/admin/settings/test-email');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to test email settings';
    }
};

export const resetSettingsToDefaults = async (category) => {
    try {
        const response = await api.post('/admin/settings/reset-defaults', null, {
            params: { category }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to reset settings';
    }
};

// Public settings (for frontend use)
export const getPublicSettings = async () => {
    try {
        const response = await api.get('/settings/public');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch public settings';
    }
};

// Service Categories
export const getServiceCategories = async () => {
    try {
        const response = await api.get('/services/categories');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch service categories';
    }
};

// Services
export const getServices = async (categoryId = null) => {
    try {
        const params = categoryId ? { category_id: categoryId } : {};
        const response = await api.get('/services', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch services';
    }
};

export const getServiceBySlug = async (slug) => {
    try {
        const response = await api.get(`/services/slug/${slug}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch service details';
    }
};

export const searchServices = async (query) => {
    try {
        const response = await api.get('/services/search', { 
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to search services';
    }
};

// Cart
export const getCartItems = async () => {
    try {
        // Add cache-busting parameter to ensure fresh data
        const response = await api.get(`/cart?_t=${Date.now()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch cart items';
    }
};

export const addToCart = async (serviceId) => {
    try {
        const response = await api.post(`/cart/${serviceId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to add item to cart';
    }
};

export const removeFromCart = async (serviceId) => {
    try {
        const response = await api.delete(`/cart/${serviceId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to remove item from cart';
    }
};

// Orders
export const createOrder = async (serviceId) => {
    try {
        const response = await api.post(`/orders/services/${serviceId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create order';
    }
};

export const createOrderFromCart = async () => {
    try {
        const response = await api.post('/orders');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create order from cart';
    }
};

export const getOrders = async () => {
    try {
        const response = await api.get('/orders');
        // Handle the new response structure with orders and pagination
        if (response.data && response.data.orders) {
            return response.data.orders;
        }
        // Fallback for old structure (if response.data is directly an array)
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch orders';
    }
};

// Payment APIs
export const createPaymentOrder = async (orderId) => {
    try {
        const response = await api.post(`/payments/orders/${orderId}/create`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create payment order';
    }
};

export const verifyPayment = async (paymentData) => {
    try {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Payment verification failed';
    }
};

export const getPaymentStatus = async (orderId) => {
    try {
        const response = await api.get(`/payments/orders/${orderId}/status`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to get payment status';
    }
};

export const getOrderByNumber = async (orderNumber) => {
    try {
        const response = await api.get(`/orders/number/${orderNumber}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch order details';
    }
}; 

// Priority Management
export const updateCategoryPriority = async (categoryId, priority) => {
    try {
        const response = await api.put(`/admin/categories/${categoryId}/priority`, { priority });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update category priority';
    }
};

export const updateServicePriority = async (serviceId, priority) => {
    try {
        const response = await api.put(`/admin/services/${serviceId}/priority`, { priority });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update service priority';
    }
}; 