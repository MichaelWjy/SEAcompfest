import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

const TestimonialsSection = () => {
    const { testimonials, addTestimonial } = useData();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        message: '',
        rating: 5,
    });
    const [errors, setErrors] = useState({});

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Name is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Review message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Review must be at least 10 characters long';
        }

        if (formData.rating < 1 || formData.rating > 5) {
            newErrors.rating = 'Rating must be between 1 and 5';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        addTestimonial(formData);
        setFormData({ customerName: '', message: '', rating: 5 });
        setShowForm(false);
        setErrors({});
    };

    const renderStars = (rating, interactive = false, onRatingChange) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    const safeTestimonial = testimonials?.[currentIndex] || null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join thousands of satisfied customers who have transformed their eating habits with SEA Catering.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Testimonial Carousel */}
                    <div className="relative">
                        {testimonials?.length > 0 && safeTestimonial ? (
                            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {safeTestimonial.customerName?.charAt(0).toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {safeTestimonial.customerName || 'Anonymous'}
                                            </h4>
                                            {renderStars(safeTestimonial.rating || 5)}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={prevTestimonial}
                                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={nextTestimonial}
                                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                                        >
                                            <ChevronRight className="h-5 w-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                <blockquote className="text-gray-700 text-lg leading-relaxed">
                                    "{safeTestimonial.message || 'No testimonial available.'}"
                                </blockquote>

                                <div className="mt-4 text-sm text-gray-500">
                                    {safeTestimonial.date
                                        ? new Date(safeTestimonial.date).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                        : 'Unknown date'}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No testimonials yet.</p>
                        )}

                        {/* Dots indicator */}
                        {testimonials?.length > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentIndex ? 'bg-emerald-500' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Testimonial Form */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-emerald-100 p-3 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
                        </div>

                        {!showForm ? (
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">
                                    Have you tried SEA Catering? We'd love to hear about your experience!
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
                                >
                                    Write a Review
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customerName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.customerName ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your name"
                                    />
                                    {errors.customerName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating *
                                    </label>
                                    {renderStars(formData.rating, true, (rating) =>
                                        setFormData((prev) => ({ ...prev, rating }))
                                    )}
                                    {errors.rating && (
                                        <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Review *
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, message: e.target.value }))
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.message ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        rows={4}
                                        placeholder="Tell us about your experience with SEA Catering..."
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setFormData({ customerName: '', message: '', rating: 5 });
                                            setErrors({});
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
