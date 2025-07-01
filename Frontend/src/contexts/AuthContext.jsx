import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../Services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token with backend
            authAPI.getCurrentUser()
                .then(response => {
                    if (response.data.success) {
                        setUser(response.data.user);
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    };

    const register = async (fullName, email, password) => {
        try {
            // Validate inputs
            if (!fullName || !email || !password) {
                throw new Error('All fields are required');
            }

            if (!validatePassword(password)) {
                throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Invalid email format');
            }

            const response = await authAPI.register({
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            if (response.data.success) {
                return { success: true };
            } else {
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || error.message || 'Registration failed'
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({
                email: email.trim().toLowerCase(),
                password
            });

            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                setUser(user);
                return { success: true };
            } else {
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};