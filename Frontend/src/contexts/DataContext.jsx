import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

    useEffect(() => {
        // Initialize meal plans
        const initialMealPlans = [
            {
                id: '1',
                name: 'Diet Plan',
                price: 30000,
                description: 'Perfect for weight management and healthy living',
                features: [
                    'Low-calorie balanced meals',
                    'Fresh vegetables and lean proteins',
                    'Portion-controlled servings',
                    'Nutritionist-approved recipes'
                ],
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                id: '2',
                name: 'Protein Plan',
                price: 40000,
                description: 'High-protein meals for active lifestyles and muscle building',
                features: [
                    'High-quality protein sources',
                    'Post-workout recovery meals',
                    'Muscle-building nutrients',
                    'Energy-boosting ingredients'
                ],
                image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                id: '3',
                name: 'Royal Plan',
                price: 60000,
                description: 'Premium gourmet meals with the finest ingredients',
                features: [
                    'Gourmet chef-prepared meals',
                    'Premium organic ingredients',
                    'Exotic and international cuisines',
                    'Luxury dining experience at home'
                ],
                image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800'
            }
        ];

        // Initialize sample testimonials
        const initialTestimonials = [
            {
                id: '1',
                customerName: 'Sarah Johnson',
                message: 'SEA Catering has transformed my eating habits! The meals are delicious and perfectly portioned.',
                rating: 5,
                date: new Date('2024-01-15')
            },
            {
                id: '2',
                customerName: 'Ahmad Rahman',
                message: 'Great service and amazing food quality. Delivery is always on time!',
                rating: 5,
                date: new Date('2024-01-20')
            },
            {
                id: '3',
                customerName: 'Maria Santos',
                message: 'The Royal Plan is absolutely worth it. Every meal feels like fine dining.',
                rating: 4,
                date: new Date('2024-01-25')
            }
        ];

        setMealPlans(initialMealPlans);

        // Load data from localStorage
        const savedTestimonials = localStorage.getItem('testimonials');
        if (savedTestimonials) {
            setTestimonials(JSON.parse(savedTestimonials));
        } else {
            setTestimonials(initialTestimonials);
            localStorage.setItem('testimonials', JSON.stringify(initialTestimonials));
        }

        const savedSubscriptions = localStorage.getItem('subscriptions');
        if (savedSubscriptions) {
            setSubscriptions(JSON.parse(savedSubscriptions));
        }
    }, []);

    const sanitizeInput = (input) => {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    };

    const addTestimonial = (testimonial) => {
        const newTestimonial = {
            ...testimonial,
            id: uuidv4(),
            customerName: sanitizeInput(testimonial.customerName),
            message: sanitizeInput(testimonial.message),
            date: new Date()
        };

        const updatedTestimonials = [...testimonials, newTestimonial];
        setTestimonials(updatedTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
    };

    const addSubscription = (subscription) => {
        const newSubscription = {
            ...subscription,
            id: uuidv4(),
            name: sanitizeInput(subscription.name),
            phone: sanitizeInput(subscription.phone),
            allergies: sanitizeInput(subscription.allergies),
            createdAt: new Date()
        };

        const updatedSubscriptions = [...subscriptions, newSubscription];
        setSubscriptions(updatedSubscriptions);
        localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
    };

    const updateSubscription = (id, updates) => {
        const updatedSubscriptions = subscriptions.map(sub =>
            sub.id === id ? { ...sub, ...updates } : sub
        );
        setSubscriptions(updatedSubscriptions);
        localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
    };

    const getUserSubscriptions = (userId) => {
        return subscriptions.filter(sub => sub.userId === userId);
    };

    const getSubscriptionStats = (startDate, endDate) => {
        const now = new Date();
        const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endDate || now;

        const filteredSubs = subscriptions.filter(sub => {
            const createdAt = new Date(sub.createdAt);
            return createdAt >= start && createdAt <= end;
        });

        const newSubscriptions = filteredSubs.length;
        const monthlyRevenue = subscriptions
            .filter(sub => sub.status === 'active')
            .reduce((total, sub) => total + sub.totalPrice, 0);

        const reactivations = subscriptions.filter(sub => {
            // This would track reactivations in a real app
            return sub.status === 'active' && sub.pausedFrom;
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
        addTestimonial,
        addSubscription,
        updateSubscription,
        getUserSubscriptions,
        getSubscriptionStats
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};