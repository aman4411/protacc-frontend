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

export const getUsers = async () => {
    try {
        const response = await api.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch users';
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

// Cart
export const getCartItems = async () => {
    try {
        const response = await api.get('/cart');
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

export const getOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch orders';
    }
};

export const getOrderByNumber = async (orderNumber) => {
    try {
        const response = await api.get(`/orders/${orderNumber}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch order details';
    }
};

export const updateOrderStatus = async (orderId, status, notes) => {
    try {
        const response = await api.patch(`/orders/${orderId}/status`, { status, notes });
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