import React from 'react';
import { Phone, User, MapPin, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Have questions about our services? Our team is here to help you start your healthy eating journey.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="bg-emerald-100 p-3 rounded-lg">
                                <User className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Manager</h3>
                                <p className="text-gray-600 text-lg">Brian</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg"><Phone className="h-6 w-6 text-blue-600" /></div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Number</h3>
                                <a href="tel:08123456789" className="text-blue-600 text-lg hover:text-blue-700 transition-colors duration-200">
                                    08123456789
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <MapPin className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Area</h3>
                                <p className="text-gray-600 text-lg">All major cities across Indonesia</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Hours</h3>
                                <p className="text-gray-600 text-lg">Monday - Sunday: 6:00 AM - 10:00 PM</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Start?</h3>
                        <p className="text-gray-600 mb-8">Join thousands of satisfied customers who have transformed their eating habits with SEA Catering.</p>
                        <div className="space-y-4">
                            <button className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors duration-200">
                                Login
                            </button>
                            <button className="w-full border-2 border-emerald-600 text-emerald-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-emerald-600 hover:text-white transition-colors duration-200">
                                View Our Menu
                            </button>
                        </div>

                        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
                            <p className="text-sm text-emerald-800 text-center">
                                <strong>Special Offer:</strong> Get 20% off your first order when you mention this website!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;