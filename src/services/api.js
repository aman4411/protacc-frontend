import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_PROTACC_API_BASE_URL;

// Log the current environment and API URL
console.log('Current Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

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

export const signup = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'An error occurred during signup';
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
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