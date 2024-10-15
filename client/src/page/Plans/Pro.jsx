import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Utensils, Activity, Headphones, Clock, Zap, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="bg-gray-800 rounded-xl p-6 shadow-lg"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Icon className="text-indigo-400 w-12 h-12 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-blue-300">{description}</p>
  </motion.div>
);

const Pro = () => {
  const features = [
    {
      icon: Camera,
      title: "Posture Tracking",
      description: "Advanced AI-powered posture analysis to help you maintain proper form during workouts and daily activities."
    },
    {
      icon: Utensils,
      title: "Custom Nutrition Plans",
      description: "Personalized meal plans tailored to your dietary preferences, allergies, and fitness goals."
    },
    {
      icon: Activity,
      title: "Custom Exercise Plans",
      description: "Individualized workout routines designed to maximize your results based on your fitness level and goals."
    },
    {
      icon: Headphones,
      title: "24/7 Expert Guidance",
      description: "Round-the-clock access to fitness experts and nutritionists for advice and motivation."
    },
    {
      icon: Clock,
      title: "Real-time Progress Tracking",
      description: "Monitor your fitness journey with detailed analytics and progress reports."
    },
    {
      icon: Zap,
      title: "AI-Powered Recommendations",
      description: "Get intelligent suggestions for workout adjustments and meal optimizations based on your progress."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Upgrade to FitVision Pro</h1>
          <p className="text-xl text-blue-300">Unlock premium features and take your fitness journey to the next level</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <motion.div 
          className="bg-gray-800 rounded-xl p-8 shadow-lg text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose FitVision Pro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              "Comprehensive health and fitness tracking",
              "Personalized guidance tailored to your needs",
              "Advanced AI-powered insights",
              "Continuous support from fitness experts",
              "Seamless integration with smart devices",
              "Regular updates with new features"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="text-green-400 w-6 h-6 mr-2" />
                <span className="text-blue-300">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Upgrade Now
          </motion.button>
        </div>

        <div className="mt-12 text-center">
          <img 
            src="https://media.mobidev.biz/2020/07/2400-human-pose-estimation-ai-fitness.jpg?strip=all&lossy=1&ssl=1" 
            alt="FitVision Pro Dashboard" 
            className="rounded-xl shadow-2xl mx-auto"
          />
          <p className="text-blue-300 mt-4">Experience the future of fitness with FitVision Pro</p>
        </div>
      </div>
    </div>
  );
};

export default Pro;