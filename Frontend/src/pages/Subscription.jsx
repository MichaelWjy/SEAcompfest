import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Check, AlertCircle } from 'lucide-react';

const Subscription = () => {
    const { user } = useAuth();
    const { addSubscription, mealPlans } = useData();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.full_name || '',
        phone: '',
        plan: '',
        mealTypes: [],
        deliveryDays: [],
        allergies: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Convert meal plans from API to the format expected by the form
    const plans = mealPlans.map(plan => ({
        id: plan.name.toLowerCase().replace(' ', ''),
        name: plan.name,
        price: plan.price
    }));

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    const deliveryDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^08\d{8,11}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid Indonesian phone number (08xxxxxxxxx)';
        }

        if (!formData.plan) {
            newErrors.plan = 'Please select a plan';
        }

        if (formData.mealTypes.length === 0) {
            newErrors.mealTypes = 'Please select at least one meal type';
        }

        if (formData.deliveryDays.length === 0) {
            newErrors.deliveryDays = 'Please select at least one delivery day';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotalPrice = () => {
        if (!formData.plan || formData.mealTypes.length === 0 || formData.deliveryDays.length === 0) {
            return 0;
        }

        const selectedPlan = plans.find(p => p.id === formData.plan);
        if (!selectedPlan) return 0;

        return selectedPlan.price * formData.mealTypes.length * formData.deliveryDays.length * 4.3;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleMealTypeChange = (mealType) => {
        setFormData(prev => ({
            ...prev,
            mealTypes: prev.mealTypes.includes(mealType)
                ? prev.mealTypes.filter(m => m !== mealType)
                : [...prev.mealTypes, mealType]
        }));
    };

    const handleDeliveryDayChange = (day) => {
        setFormData(prev => ({
            ...prev,
            deliveryDays: prev.deliveryDays.includes(day)
                ? prev.deliveryDays.filter(d => d !== day)
                : [...prev.deliveryDays, day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const selectedPlan = plans.find(p => p.id === formData.plan);
            if (!selectedPlan || !user) {
                throw new Error('Invalid plan or user');
            }

            const subscription = {
                name: formData.name,
                phone: formData.phone,
                plan: selectedPlan.name,
                planPrice: selectedPlan.price,
                mealTypes: formData.mealTypes,
                deliveryDays: formData.deliveryDays,
                allergies: formData.allergies,
                totalPrice: calculateTotalPrice()
            };

            const result = await addSubscription(subscription);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setErrors({ submit: result.error || 'Failed to create subscription. Please try again.' });
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setErrors({ submit: 'Failed to create subscription. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = calculateTotalPrice();

    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Subscribe to SEA Catering
                    </h1>
                    <p className="text-xl text-gray-600">
                        Customize your meal plan and start your healthy eating journey
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                                    <AlertCircle className="h-5 w-5" />
                                    <span>{errors.submit}</span>
                                </div>
                            )}

                            {/* Personal Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Active Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="08123456789"
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Plan Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Selection *</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200 ${formData.plan === plan.id
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 hover:border-emerald-300'
                                                }`}
                                            onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                                        >
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className={`w-4 h-4 rounded-full border-2 ${formData.plan === plan.id
                                                        ? 'border-emerald-500 bg-emerald-500'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {formData.plan === plan.id && (
                                                        <Check className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                                            </div>
                                            <p className="text-emerald-600 font-bold">{formatPrice(plan.price)}</p>
                                            <p className="text-sm text-gray-500">per meal</p>
                                        </div>
                                    ))}
                                </div>
                                {errors.plan && <p className="mt-1 text-sm text-red-600">{errors.plan}</p>}
                            </div>

                            {/* Meal Types */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Types *</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {mealTypes.map((mealType) => (
                                        <label
                                            key={mealType}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200 flex items-center space-x-3 ${formData.mealTypes.includes(mealType)
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 hover:border-emerald-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.mealTypes.includes(mealType)}
                                                onChange={() => handleMealTypeChange(mealType)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.mealTypes.includes(mealType)
                                                    ? 'border-emerald-500 bg-emerald-500'
                                                    : 'border-gray-300'
                                                }`}>
                                                {formData.mealTypes.includes(mealType) && (
                                                    <Check className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-900">{mealType}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.mealTypes && <p className="mt-1 text-sm text-red-600">{errors.mealTypes}</p>}
                            </div>

                            {/* Delivery Days */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Days *</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                                    {deliveryDays.map((day) => (
                                        <label
                                            key={day}
                                            className={`border-2 rounded-lg p-3 cursor-pointer transition-colors duration-200 text-center ${formData.deliveryDays.includes(day)
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 hover:border-emerald-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.deliveryDays.includes(day)}
                                                onChange={() => handleDeliveryDayChange(day)}
                                                className="sr-only"
                                            />
                                            <div className="text-sm font-medium text-gray-900">{day.slice(0, 3)}</div>
                                            {formData.deliveryDays.includes(day) && (
                                                <Check className="h-4 w-4 text-emerald-500 mx-auto mt-1" />
                                            )}
                                        </label>
                                    ))}
                                </div>
                                {errors.deliveryDays && <p className="mt-1 text-sm text-red-600">{errors.deliveryDays}</p>}
                            </div>

                            {/* Allergies */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies & Dietary Restrictions</h3>
                                <textarea
                                    value={formData.allergies}
                                    onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    rows={3}
                                    placeholder="Please list any allergies or dietary restrictions (optional)"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || totalPrice === 0}
                                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {loading ? 'Creating Subscription...' : 'Subscribe Now'}
                            </button>
                        </form>
                    </div>

                    {/* Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                            {formData.plan && (
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Plan:</span>
                                        <span className="font-medium">
                                            {plans.find(p => p.id === formData.plan)?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price per meal:</span>
                                        <span className="font-medium">
                                            {formatPrice(plans.find(p => p.id === formData.plan)?.price || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Meal types:</span>
                                        <span className="font-medium">{formData.mealTypes.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery days:</span>
                                        <span className="font-medium">{formData.deliveryDays.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Weeks per month:</span>
                                        <span className="font-medium">4.3</span>
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Monthly Total:</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            {totalPrice > 0 && (
                                <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                                    <p className="text-sm text-emerald-800">
                                        <strong>Calculation:</strong><br />
                                        {formatPrice(plans.find(p => p.id === formData.plan)?.price || 0)} × {formData.mealTypes.length} × {formData.deliveryDays.length} × 4.3
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;