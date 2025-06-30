import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getCurrentUser: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
};

// Meal Plans API
export const mealPlansAPI = {
    getAll: () => api.get('/meal-plans'),
    getById: (id) => api.get(`/meal-plans/${id}`),
};

// Subscriptions API
export const subscriptionsAPI = {
    create: (subscriptionData) => api.post('/subscriptions', subscriptionData),
    getMySubscriptions: () => api.get('/subscriptions/my-subscriptions'),
    updateStatus: (id, statusData) => api.put(`/subscriptions/${id}/status`, statusData),
};

// Testimonials API
export const testimonialsAPI = {
    getAll: () => api.get('/testimonials'),
    create: (testimonialData) => api.post('/testimonials', testimonialData),
};

// Admin API
export const adminAPI = {
    getStats: (params) => api.get('/admin/stats', { params }),
    getSubscriptions: (params) => api.get('/admin/subscriptions', { params }),
    getUsers: (params) => api.get('/admin/users', { params }),
    getTestimonials: () => api.get('/admin/testimonials'),
    updateTestimonialApproval: (id, data) => api.put(`/admin/testimonials/${id}/approval`, data),
};

export default api;