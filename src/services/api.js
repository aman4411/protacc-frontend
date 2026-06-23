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

// Auth endpoints that may legitimately return 401 (wrong credentials, etc.)
const AUTH_ENDPOINTS_NO_REDIRECT = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
];

const isAuthEndpointWithoutRedirect = (config) => {
    const url = config?.url || '';
    return AUTH_ENDPOINTS_NO_REDIRECT.some((path) => url.includes(path));
};

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isAuthEndpointWithoutRedirect(error.config)) {
            localStorage.removeItem('protacc_auth_token');
            const isOnLoginPage = window.location.pathname === '/login';
            if (!isOnLoginPage) {
                window.location.href = '/login';
            }
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

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update profile';
    }
};

export const requestPasswordReset = async () => {
    try {
        const response = await api.post('/user/change-password-request');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to send password reset email';
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to send password reset email';
    }
};

export const validateResetToken = async (token) => {
    try {
        const response = await api.get('/auth/reset-password/validate', {
            params: { token },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Invalid or expired reset link';
    }
};

export const resetPassword = async (data) => {
    try {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to reset password';
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

export const getOrderDocuments = async (orderId, isAdmin = false) => {
    try {
        const base = isAdmin ? '/admin/orders' : '/orders';
        const response = await api.get(`${base}/${orderId}/documents`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch order documents';
    }
};

export const addOrderDocument = async (orderId, data) => {
    try {
        const response = await api.post(`/orders/${orderId}/documents`, {
            title: data.title,
            driveUrl: data.driveUrl,
            notes: data.notes || '',
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to submit document';
    }
};

export const addAdminOrderDocument = async (orderId, data) => {
    try {
        const response = await api.post(`/admin/orders/${orderId}/documents`, {
            title: data.title,
            driveUrl: data.driveUrl,
            notes: data.notes || '',
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to share document';
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

// ===== Reviews =====

// Public: reviews + aggregate summary for a service.
export const getServiceReviews = async (serviceId) => {
    try {
        const response = await api.get(`/services/${serviceId}/reviews`);
        return response.data; // { reviews: [...], summary: { average, count } }
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch reviews';
    }
};

// Public: top reviews for the homepage.
export const getTopReviews = async (limit = 6) => {
    try {
        const response = await api.get('/reviews/top', { params: { limit } });
        return response.data?.reviews || [];
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch reviews';
    }
};

// Auth: whether the current user can review a service (and any existing review).
export const getReviewEligibility = async (serviceId) => {
    try {
        const response = await api.get('/reviews/eligibility', { params: { service_id: serviceId } });
        return response.data; // { can_review, already_reviewed, existing }
    } catch (error) {
        throw error.response?.data?.error || 'Failed to check review eligibility';
    }
};

// Auth: create or update the current user's review for a service.
export const submitReview = async ({ serviceId, rating, comment }) => {
    try {
        const response = await api.post('/reviews', { service_id: serviceId, rating, comment });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to submit review';
    }
};

// Admin: list all reviews / delete a review.
export const getAdminReviews = async () => {
    try {
        const response = await api.get('/admin/reviews');
        return response.data?.reviews || [];
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch reviews';
    }
};

export const deleteAdminReview = async (reviewId) => {
    try {
        const response = await api.delete(`/admin/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete review';
    }
};

// Admin: create a review with a custom reviewer name (no purchase tie).
export const adminCreateReview = async ({ serviceId, rating, comment, reviewerName }) => {
    try {
        const response = await api.post('/admin/reviews', {
            service_id: serviceId,
            rating,
            comment,
            reviewer_name: reviewerName,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create review';
    }
};

// Admin: show/hide a review.
export const updateAdminReviewStatus = async (reviewId, status) => {
    try {
        const response = await api.put(`/admin/reviews/${reviewId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update review';
    }
};

// Cart
export const getCartItems = async () => {
    try {
        const response = await api.get('/cart');
        const data = response.data;
        return Array.isArray(data) ? data : [];
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

export const createOrderFromCart = async (couponCode = '') => {
    try {
        const body = couponCode ? { coupon_code: couponCode } : {};
        const response = await api.post('/orders', body);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create order from cart';
    }
};

// Validate a coupon against the user's current cart. Returns
// { amounts: { subtotal, discount_amount, total_amount, booking_amount, remaining_amount }, coupon }.
export const previewCoupon = async (code) => {
    try {
        const response = await api.post('/orders/coupon/preview', { code });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Invalid coupon code';
    }
};

// Public: coupons flagged to display on the cart page.
export const getAvailableCoupons = async () => {
    try {
        const response = await api.get('/coupons/available');
        return response.data?.coupons || [];
    } catch (error) {
        return []; // non-critical
    }
};

// ===== Deadlines (tax/compliance calendar) =====
export const getUpcomingDeadlines = async (limit = 8) => {
    try {
        const response = await api.get('/deadlines/upcoming', { params: { limit } });
        return response.data?.deadlines || [];
    } catch (error) {
        return []; // non-critical
    }
};

export const getAdminDeadlines = async () => {
    try {
        const response = await api.get('/admin/deadlines');
        return response.data?.deadlines || [];
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch deadlines';
    }
};

export const createDeadline = async (data) => {
    try {
        const response = await api.post('/admin/deadlines', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create deadline';
    }
};

export const updateDeadline = async (id, data) => {
    try {
        const response = await api.put(`/admin/deadlines/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update deadline';
    }
};

export const deleteDeadline = async (id) => {
    try {
        const response = await api.delete(`/admin/deadlines/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete deadline';
    }
};

// Public: coupons flagged for the homepage campaign banner.
export const getHomepageCoupons = async () => {
    try {
        const response = await api.get('/coupons/promotions');
        return response.data?.coupons || [];
    } catch (error) {
        return []; // non-critical
    }
};

// ===== Admin: coupons =====
export const getAdminCoupons = async () => {
    try {
        const response = await api.get('/admin/coupons');
        return response.data?.coupons || [];
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch coupons';
    }
};

export const createCoupon = async (data) => {
    try {
        const response = await api.post('/admin/coupons', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to create coupon';
    }
};

export const updateCoupon = async (id, data) => {
    try {
        const response = await api.put(`/admin/coupons/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update coupon';
    }
};

export const deleteCoupon = async (id) => {
    try {
        const response = await api.delete(`/admin/coupons/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete coupon';
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

// Analytics APIs
export const getRevenueAnalytics = async (period = '30') => {
    try {
        const response = await api.get(`/admin/analytics/revenue?period=${period}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch revenue analytics';
    }
};

export const getOrderAnalytics = async (period = '30') => {
    try {
        const response = await api.get(`/admin/analytics/orders?period=${period}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch order analytics';
    }
};

export const getUserAnalytics = async (period = '30') => {
    try {
        const response = await api.get(`/admin/analytics/users?period=${period}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch user analytics';
    }
};

export const getServiceAnalytics = async (period = '30') => {
    try {
        const response = await api.get(`/admin/analytics/services?period=${period}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch service analytics';
    }
};

export const getOverallMetrics = async (period = '30') => {
    try {
        const response = await api.get(`/admin/analytics/metrics?period=${period}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch overall metrics';
    }
};

export const getRecentActivity = async (limit = '10') => {
    try {
        const response = await api.get(`/admin/analytics/activity?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch recent activity';
    }
};

// User-specific orders
export const getUserOrders = async (userId) => {
    try {
        const response = await api.get(`/admin/users/${userId}/orders`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch user orders';
    }
};

// Lead Management APIs (Public)
export const createLead = async (leadData) => {
    try {
        const response = await api.post('/leads', leadData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to submit. Please try again.';
    }
};

// Contact APIs (Public)
export const createContact = (contactData) => api.post('/contact', contactData);

// Lead Management APIs (Admin)
export const getLeads = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        const response = await api.get(`/admin/leads?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch leads';
    }
};

export const getLeadById = async (leadId) => {
    try {
        const response = await api.get(`/admin/leads/${leadId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch lead';
    }
};

export const updateLead = async (leadId, updates) => {
    try {
        const response = await api.put(`/admin/leads/${leadId}`, updates);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update lead';
    }
};

export const deleteLead = async (leadId) => {
    try {
        const response = await api.delete(`/admin/leads/${leadId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete lead';
    }
};

export const getLeadStats = async () => {
    try {
        const response = await api.get('/admin/leads/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch lead stats';
    }
};

// Contact Management APIs (Admin)
export const getContacts = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        const response = await api.get(`/admin/contacts?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch contacts';
    }
};

export const getContactById = async (contactId) => {
    try {
        const response = await api.get(`/admin/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch contact';
    }
};

export const updateContactStatus = async (contactId, updates) => {
    try {
        const response = await api.put(`/admin/contacts/${contactId}`, updates);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to update contact status';
    }
};

export const deleteContact = async (contactId) => {
    try {
        const response = await api.delete(`/admin/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to delete contact';
    }
};

export const getContactStats = async () => {
    try {
        const response = await api.get('/admin/contacts/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch contact stats';
    }
}; 