import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Features from '../components/Features';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Homepage = () => {
  return (
    <>
    <Navbar/>
      <section id="home" className="pt-16 bg-gradient-to-br from-emerald-50 via-white to-orange-50 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Content */}
            <div className="mb-12 lg:mb-0">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">Trusted by thousands across Indonesia</span>
              </div>
                
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-emerald-600">SEA Catering</span>
                <br />
                <span className="text-2xl md:text-4xl text-gray-700 font-medium">
                  Healthy Meals, Anytime, Anywhere
                </span>
              </h1>
                
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover Indonesia's most trusted customizable healthy meal service. 
                From Jakarta to Bali, we deliver fresh, nutritious meals tailored to your lifestyle, 
                right to your doorstep.
              </p>
                
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center group">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-600 hover:text-white transition-colors duration-200">
                  View Menu
                </button>
              </div>
                
              <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">50K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">25+</div>
                  <div className="text-gray-600">Cities Covered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">100%</div>
                  <div className="text-gray-600">Fresh Ingredients</div>
                </div>
              </div>
            </div>
                
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Healthy meal bowl"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">4.9</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Excellent Rating</div>
                    <div className="text-sm text-gray-600">Based on 10,000+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Features/>
      <Contact/>
      <Footer/>
    </>
  );
};

export default Homepage;