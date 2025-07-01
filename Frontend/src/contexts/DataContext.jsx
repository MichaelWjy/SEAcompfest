import React, { createContext, useContext, useState, useEffect } from 'react';
import { mealPlansAPI, testimonialsAPI, subscriptionsAPI } from '../Services/api';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [mealPlans, setMealPlans] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            // Load meal plans
            const mealPlansResponse = await mealPlansAPI.getAll();
            if (mealPlansResponse.data.success) {
                setMealPlans(mealPlansResponse.data.mealPlans);
            }

            // Load testimonials
            const testimonialsResponse = await testimonialsAPI.getAll();
            if (testimonialsResponse.data.success) {
                setTestimonials(testimonialsResponse.data.testimonials);
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTestimonial = async (testimonial) => {
        try {
            const response = await testimonialsAPI.create({
                customerName: testimonial.customerName,
                message: testimonial.message,
                rating: testimonial.rating
            });

            if (response.data.success) {
                // Reload testimonials to get updated list
                const testimonialsResponse = await testimonialsAPI.getAll();
                if (testimonialsResponse.data.success) {
                    setTestimonials(testimonialsResponse.data.testimonials);
                }
                return { success: true };
            } else {
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error adding testimonial:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to add testimonial'
            };
        }
    };

    const addSubscription = async (subscription) => {
        try {
            const response = await subscriptionsAPI.create({
                name: subscription.name,
                phone: subscription.phone,
                planName: subscription.plan,
                planPrice: subscription.planPrice,
                mealTypes: subscription.mealTypes,
                deliveryDays: subscription.deliveryDays,
                allergies: subscription.allergies,
                totalPrice: subscription.totalPrice
            });

            if (response.data.success) {
                // Reload user subscriptions
                await loadUserSubscriptions();
                return { success: true };
            } else {
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error adding subscription:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to create subscription'
            };
        }
    };

    const loadUserSubscriptions = async () => {
        try {
            const response = await subscriptionsAPI.getMySubscriptions();
            if (response.data.success) {
                setSubscriptions(response.data.subscriptions);
            }
        } catch (error) {
            console.error('Error loading user subscriptions:', error);
        }
    };

    const updateSubscription = async (id, updates) => {
        try {
            const response = await subscriptionsAPI.updateStatus(id, updates);
            if (response.data.success) {
                // Reload user subscriptions
                await loadUserSubscriptions();
                return { success: true };
            } else {
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to update subscription'
            };
        }
    };

    const getUserSubscriptions = (userId) => {
        // Since we're now loading from API, we don't filter by userId here
        // The API already returns only the current user's subscriptions
        return subscriptions;
    };

    const getSubscriptionStats = async (startDate, endDate) => {
        // This would be implemented for admin dashboard
        // For now, return basic stats from current subscriptions
        const now = new Date();
        const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endDate || now;

        const filteredSubs = subscriptions.filter(sub => {
            const createdAt = new Date(sub.created_at);
            return createdAt >= start && createdAt <= end;
        });

        const newSubscriptions = filteredSubs.length;
        const monthlyRevenue = subscriptions
            .filter(sub => sub.status === 'active')
            .reduce((total, sub) => total + sub.total_price, 0);

        const reactivations = subscriptions.filter(sub => {
            return sub.status === 'active' && sub.paused_from;
        }).length;

        const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;

        return {
            newSubscriptions,
            monthlyRevenue,
            reactivations,
            activeSubscriptions
        };
    };

    const value = {
        mealPlans,
        testimonials,
        subscriptions,
        loading,
        addTestimonial,
        addSubscription,
        updateSubscription,
        getUserSubscriptions,
        getSubscriptionStats,
        loadUserSubscriptions
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};