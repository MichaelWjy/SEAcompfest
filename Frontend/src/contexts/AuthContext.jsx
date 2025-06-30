import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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

    useEffect(() => {
        // Check for existing session only - no default user creation
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            setUser(JSON.parse(currentUser));
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

    const sanitizeInput = (input) => {
        return input
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '')
                .replace(/\//g, '/');
    };

    const register = async (fullName, email, password) => {
        try {
            // Sanitize inputs
            const sanitizedName = sanitizeInput(fullName.trim());
            const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());

            // Validate inputs
            if (!sanitizedName || !sanitizedEmail || !password) {
                throw new Error('All fields are required');
            }

            if (!validatePassword(password)) {
                throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sanitizedEmail)) {
                throw new Error('Invalid email format');
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Check if user already exists
            if (users.find((u) => u.email === sanitizedEmail)) {
                throw new Error('User already exists');
            }

            const newUser = {
                id: uuidv4(),
                fullName: sanitizedName,
                email: sanitizedEmail,
                password: bcrypt.hashSync(password, 10),
                isAdmin: false, // All new users are regular users by default
                createdAt: new Date()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            const foundUser = users.find((u) => u.email === sanitizedEmail);

            if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
                const userWithoutPassword = { ...foundUser };
                delete userWithoutPassword.password;
                setUser(userWithoutPassword);
                localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};