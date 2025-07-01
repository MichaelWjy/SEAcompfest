import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { X, Check } from 'lucide-react';

const MenuPlans = () => {
    const { mealPlans } = useData();
    const [selectedPlan, setSelectedPlan] = useState(null);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Our Meal Plans
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose from our carefully crafted meal plans designed to meet your nutritional needs and lifestyle goals.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mealPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={plan.image_url}
                                    alt={plan.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-emerald-600">
                                            {formatPrice(plan.price)}
                                        </div>
                                        <div className="text-sm text-gray-500">per meal</div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6">{plan.description}</p>

                                <div className="space-y-3 mb-8">
                                    {plan.features.slice(0, 3).map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setSelectedPlan(plan)}
                                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
                                >
                                    See More Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedPlan && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="relative">
                                <img
                                    src={selectedPlan.image_url}
                                    alt={selectedPlan.name}
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <X className="h-6 w-6 text-gray-600" />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900">{selectedPlan.name}</h2>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-emerald-600">
                                            {formatPrice(selectedPlan.price)}
                                        </div>
                                        <div className="text-sm text-gray-500">per meal</div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-8 text-lg">{selectedPlan.description}</p>

                                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included:</h3>
                                <div className="space-y-3 mb-8">
                                    {selectedPlan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-emerald-50 p-6 rounded-lg mb-6">
                                    <h4 className="font-semibold text-emerald-800 mb-2">Perfect for:</h4>
                                    <p className="text-emerald-700">
                                        {selectedPlan.name === 'Diet Plan' && 'Individuals looking to maintain a healthy weight and improve overall wellness.'}
                                        {selectedPlan.name === 'Protein Plan' && 'Active individuals, athletes, and fitness enthusiasts who need extra protein for muscle building and recovery.'}
                                        {selectedPlan.name === 'Royal Plan' && 'Food lovers who want to enjoy gourmet meals without compromising on nutrition and quality.'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
                                >
                                    Choose This Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPlans;