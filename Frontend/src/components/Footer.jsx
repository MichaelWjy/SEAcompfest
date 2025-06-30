import React from 'react';
import { Utensils, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-emerald-500 p-2 rounded-lg">
                                <Utensils className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">SEA Catering</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Indonesia's leading customizable healthy meal delivery service.
                            Bringing nutritious, delicious meals to your doorstep across the nation.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#home" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
                            <li><a href="#menu" className="text-gray-400 hover:text-white transition-colors duration-200">Menu / Meal Plans</a></li>
                            <li><a href="#subscription" className="text-gray-400 hover:text-white transition-colors duration-200">Subscription</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Manager: Brian</li>
                            <li>Phone: 08123456789</li>
                            <li>Service: Nationwide Indonesia</li>
                            <li>Hours: 6AM - 10PM Daily</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2024 SEA Catering. All rights reserved. | Healthy Meals, Anytime, Anywhere
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;