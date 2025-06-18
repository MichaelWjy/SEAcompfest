import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Calendar, Pause, X, CheckCircle, Clock, XCircle } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();
    const { getUserSubscriptions, updateSubscription } = useData();
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [pauseData, setPauseData] = useState({ from: '', to: '' });
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const subscriptions = user ? getUserSubscriptions(user.id) : [];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePauseSubscription = () => {
        if (selectedSubscription && pauseData.from && pauseData.to) {
            updateSubscription(selectedSubscription, {
                status: 'paused',
                pausedFrom: new Date(pauseData.from),
                pausedTo: new Date(pauseData.to)
            });
            setShowPauseModal(false);
            setPauseData({ from: '', to: '' });
            setSelectedSubscription(null);
        }
    };

    const handleCancelSubscription = () => {
        if (selectedSubscription) {
            updateSubscription(selectedSubscription, {
                status: 'cancelled'
            });
            setShowCancelModal(false);
            setSelectedSubscription(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'paused':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-green-600 bg-green-50';
            case 'paused':
                return 'text-yellow-600 bg-yellow-50';
            case 'cancelled':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.fullName}!
                    </h1>
                    <p className="text-gray-600">Manage your SEA Catering subscriptions</p>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscriptions</h3>
                        <p className="text-gray-600 mb-6">You haven't subscribed to any meal plans yet.</p>
                        <a
                            href="/subscription"
                            className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
                        >
                            Start Your Subscription
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {subscriptions.map((subscription) => (
                            <div key={subscription.id} className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{subscription.plan}</h3>
                                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                                                {getStatusIcon(subscription.status)}
                                                <span className="capitalize">{subscription.status}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">Subscribed on {formatDate(subscription.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-emerald-600">
                                            {formatPrice(subscription.totalPrice)}
                                        </div>
                                        <div className="text-sm text-gray-500">per month</div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Meal Types</h4>
                                        <div className="space-y-1">
                                            {subscription.mealTypes.map((meal, index) => (
                                                <span key={index} className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm mr-1">
                                                    {meal}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Delivery Days</h4>
                                        <div className="space-y-1">
                                            {subscription.deliveryDays.map((day, index) => (
                                                <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-1">
                                                    {day.slice(0, 3)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                                        <p className="text-gray-600 text-sm">{subscription.phone}</p>
                                        {subscription.allergies && (
                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">Allergies:</span>
                                                <p className="text-sm text-gray-600">{subscription.allergies}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {subscription.status === 'paused' && subscription.pausedFrom && subscription.pausedTo && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                        <p className="text-yellow-800">
                                            <strong>Paused:</strong> {formatDate(subscription.pausedFrom)} - {formatDate(subscription.pausedTo)}
                                        </p>
                                    </div>
                                )}

                                {subscription.status === 'active' && (
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => {
                                                setSelectedSubscription(subscription.id);
                                                setShowPauseModal(true);
                                            }}
                                            className="flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                        >
                                            <Pause className="h-4 w-4" />
                                            <span>Pause Subscription</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedSubscription(subscription.id);
                                                setShowCancelModal(true);
                                            }}
                                            className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                        >
                                            <X className="h-4 w-4" />
                                            <span>Cancel Subscription</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pause Modal */}
                {showPauseModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Pause Subscription</h3>
                            <p className="text-gray-600 mb-6">
                                Select the date range for pausing your subscription. No charges will be applied during this period.
                            </p>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                    <input
                                        type="date"
                                        value={pauseData.from}
                                        onChange={(e) => setPauseData(prev => ({ ...prev, from: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                    <input
                                        type="date"
                                        value={pauseData.to}
                                        onChange={(e) => setPauseData(prev => ({ ...prev, to: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        min={pauseData.from || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => {
                                        setShowPauseModal(false);
                                        setPauseData({ from: '', to: '' });
                                        setSelectedSubscription(null);
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePauseSubscription}
                                    disabled={!pauseData.from || !pauseData.to}
                                    className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Pause Subscription
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Subscription</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to cancel this subscription? This action cannot be undone.
                            </p>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setSelectedSubscription(null);
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Keep Subscription
                                </button>
                                <button
                                    onClick={handleCancelSubscription}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;