import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Utensils, Check, X } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const passwordRequirements = [
        { text: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
        { text: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
        { text: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
        { text: 'One number', test: (pwd) => /\d/.test(pwd) },
        { text: 'One special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const allRequirementsMet = passwordRequirements.every(req => req.test(formData.password));
        if (!allRequirementsMet) {
            setError('Password does not meet all requirements');
            return;
        }

        setLoading(true);

        try {
            const success = await register(formData.fullName, formData.email, formData.password);
            if (success) {
                navigate('/login', {
                    state: {
                        message: 'Account created successfully! Please sign in.'
                    }
                });
            } else {
                setError('Registration failed. Email may already be in use.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="bg-emerald-500 p-3 rounded-lg">
                            <Utensils className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join SEA Catering for healthy meals delivered to your door
                    </p>
                </div>

                <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    {passwordRequirements.map((req, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            {req.test(formData.password) ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <X className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className={`text-xs ${req.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                                                {req.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && (
                                <div className="mt-1 flex items-center space-x-2">
                                    {formData.password === formData.confirmPassword ? (
                                        <>
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-xs text-green-600">Passwords match</span>
                                        </>
                                    ) : (
                                        <>
                                            <X className="h-4 w-4 text-red-500" />
                                            <span className="text-xs text-red-600">Passwords do not match</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;