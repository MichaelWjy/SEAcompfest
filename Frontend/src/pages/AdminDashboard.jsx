import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, TrendingUp, Users, DollarSign, RotateCcw } from 'lucide-react';

const AdminDashboard = () => {
    const { getSubscriptionStats, subscriptions } = useData();
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const stats = getSubscriptionStats(
        new Date(dateRange.start),
        new Date(dateRange.end)
    );

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
            month: 'short',
            day: 'numeric'
        });
    };

    const recentSubscriptions = subscriptions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Monitor SEA Catering business performance</p>
                </div>

                {/* Date Range Selector */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Date Range Filter</h3>
                    </div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New Subscriptions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.newSubscriptions}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {dateRange.start} to {dateRange.end}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.monthlyRevenue)}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            From active subscriptions
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Reactivations</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.reactivations}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <RotateCcw className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Cancelled then restarted
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                            </div>
                            <div className="bg-emerald-100 p-3 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Currently active
                        </p>
                    </div>
                </div>

                {/* Recent Subscriptions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Subscriptions</h3>

                    {recentSubscriptions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No subscriptions found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Monthly Price</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSubscriptions.map((subscription) => (
                                        <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{subscription.name}</p>
                                                    <p className="text-sm text-gray-500">{subscription.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{subscription.plan}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {subscription.mealTypes.length} meals, {subscription.deliveryDays.length} days
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                                    {subscription.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-gray-900">
                                                {formatPrice(subscription.totalPrice)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {formatDate(subscription.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;