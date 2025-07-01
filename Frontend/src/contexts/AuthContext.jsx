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
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const checkExistingSession = () => {
            try {
                const currentUser = localStorage.getItem('currentUser');
                const loginTimestamp = localStorage.getItem('loginTimestamp');

                if (currentUser && loginTimestamp) {
                    const user = JSON.parse(currentUser);
                    const timestamp = parseInt(loginTimestamp);
                    const now = Date.now();
                    const sessionDuration = 7 * 24 * 60 * 60 * 1000; 

                    if (now - timestamp < sessionDuration) {
                        setUser(user);
                    } else {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('loginTimestamp');
                    }
                }
            } catch (error) {
                console.error('Error checking existing session:', error);
                // Clear corrupted data
                localStorage.removeItem('currentUser');
                localStorage.removeItem('loginTimestamp');
            } finally {
                setLoading(false);
            }
        };

        checkExistingSession();
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
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    };

    const register = async (fullName, email, password) => {
        try {
            const sanitizedName = sanitizeInput(fullName.trim());
            const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());

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

            if (users.find((u) => u.email === sanitizedEmail)) {
                throw new Error('User already exists');
            }

            const newUser = {
                id: uuidv4(),
                fullName: sanitizedName,
                email: sanitizedEmail,
                password: bcrypt.hashSync(password, 10),
                isAdmin: false, 
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

    const login = async (email, password, rememberMe = true) => {
        try {
            const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            const foundUser = users.find((u) => u.email === sanitizedEmail);

            if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
                const userWithoutPassword = { ...foundUser };
                delete userWithoutPassword.password;

                setUser(userWithoutPassword);

                if (rememberMe) {
                    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                    localStorage.setItem('loginTimestamp', Date.now().toString());
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                }

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
        localStorage.removeItem('loginTimestamp');
        sessionStorage.removeItem('currentUser');
    };

    const updateUserSession = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUserSession,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};