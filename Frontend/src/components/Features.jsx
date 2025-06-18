import React from 'react';
import { Utensils, Truck, BarChart3, Clock, Shield, Heart } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Utensils,
      title: 'Meal Customization',
      description: 'Personalize your meals based on dietary preferences, allergies, and nutritional goals. Our chefs create dishes tailored just for you.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'We deliver to major cities across Indonesia, from Jakarta and Surabaya to Bali and Medan, ensuring fresh meals reach you on time.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Detailed Nutrition Info',
      description: 'Get complete nutritional breakdowns for every meal, including calories, macros, vitamins, and minerals to support your health goals.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Choose your preferred delivery times and meal frequency. From daily deliveries to weekly meal prep, we adapt to your schedule.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'All ingredients are sourced from trusted suppliers and prepared in certified kitchens following strict hygiene standards.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Heart,
      title: 'Health-Focused',
      description: 'Our nutritionists and chefs work together to create balanced meals that support your wellness journey and dietary requirements.',
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SEA Catering?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've revolutionized healthy eating in Indonesia with our comprehensive approach to nutrition and convenience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;