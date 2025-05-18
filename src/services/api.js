import axios from 'axios';

const API_BASE_URL = 'https://protacc-backend.onrender.com/api/v1' || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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