/* eslint-disable react/prop-types */

import { motion } from 'framer-motion';
import { ChefHat, Dumbbell, Camera, Clipboard, Brain, Zap, Users, TrendingUp } from 'lucide-react';

const About = () => {
    const imageLink="https://stayfitcentral.b-cdn.net/wp-content/uploads/2024/04/Endura-AI-Personal-Trainer--1400x800.webp"
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto">


                <motion.div className="mb-16 relative" variants={itemVariants}>
                    <img
                        src={imageLink}
                        alt="FitVision App"
                        className="w-full h-96 object-cover rounded-xl shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-xl"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <h2 className="text-4xl font-bold mb-4">AI-Powered Fitness Revolution</h2>
                        <p className="text-xl">Transforming lives through intelligent technology and personalized guidance</p>
                    </div>
                </motion.div>

                <motion.p className="text-2xl mb-16 text-center leading-relaxed" variants={itemVariants}>
                    FitVision harnesses the power of artificial intelligence to provide you with a truly personalized fitness experience. Our cutting-edge AI algorithms analyze your unique physiology, goals, and preferences to create tailored workout and nutrition plans that evolve with you.
                </motion.p>

                <motion.h2 className="text-3xl font-bold mb-12 text-center" variants={itemVariants}>
                    Our AI-Powered Features
                </motion.h2>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16" variants={containerVariants}>
                    <Feature
                        icon={<Brain size={40} />}
                        title="Intelligent Adaptive Planning"
                        description="Our AI continuously learns from your progress, adjusting your plans for optimal results."
                    />
                    <Feature
                        icon={<ChefHat size={40} />}
                        title="AI-Crafted Nutrition"
                        description="Personalized meal plans using AI to balance macronutrients and cater to your taste preferences."
                    />
                    <Feature
                        icon={<Dumbbell size={40} />}
                        title="Smart Workout Generation"
                        description="AI-generated exercises tailored to your fitness level, equipment, and goals."
                    />
                    <Feature
                        icon={<Camera size={40} />}
                        title="Real-time Pose Correction"
                        description="Advanced computer vision ensures proper form and technique during workouts."
                    />
                </motion.div>

                <motion.h2 className="text-3xl font-bold mb-12 text-center" variants={itemVariants}>
                    The FitVision Advantage
                </motion.h2>

                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" variants={containerVariants}>
                    <AdvantageCard
                        icon={<Zap size={32} />}
                        title="Personalization at Scale"
                        description="Our AI tailors every aspect of your fitness journey, from workouts to nutrition, ensuring a truly personalized experience for every user."
                    />
                    <AdvantageCard
                        icon={<Users size={32} />}
                        title="Community Insights"
                        description="Leverage collective wisdom with our AI-driven community features, connecting you with like-minded individuals and shared experiences."
                    />
                    <AdvantageCard
                        icon={<Clipboard size={32} />}
                        title="Predictive Health Analytics"
                        description="Stay ahead of your health with AI-powered predictive analytics, identifying potential issues before they become problems."
                    />
                    <AdvantageCard
                        icon={<TrendingUp size={32} />}
                        title="Continuous Improvement"
                        description="Our AI never stops learning, constantly refining its algorithms to provide you with the most up-to-date and effective fitness strategies."
                    />
                </motion.div>

                <motion.div className="text-center" variants={itemVariants}>
                    <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Fitness Journey?</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105">
                        Get Started Now
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Feature = ({ icon, title, description }) => {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-xl backdrop-blur-sm"
            variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
            }}
        >
            <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-3 rounded-full">{icon}</div>
                <h3 className="text-xl font-semibold ml-4">{title}</h3>
            </div>
            <p className="text-gray-300">{description}</p>
        </motion.div>
    );
};

const AdvantageCard = ({ icon, title, description }) => {
    return (
        <motion.div
            className="bg-gradient-to-br from-blue-800 to-purple-900 p-8 rounded-xl shadow-2xl"
            variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
            }}
        >
            <div className="flex items-center mb-6">
                <div className="bg-blue-500 p-3 rounded-full mr-4">{icon}</div>
                <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            <p className="text-gray-300 text-lg">{description}</p>
        </motion.div>
    );
};

export default About;