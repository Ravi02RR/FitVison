import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check, Star, Activity, Heart, Zap, ChefHat, Camera, ChevronRight, Play } from 'lucide-react';

//const imageLink = "https://stayfitcentral.b-cdn.net/wp-content/uploads/2023/12/DALL%C2%B7E-2024-01-02-14.38.34-A-futuristic-AI-chatbot-named-Endura-designed-as-a-personal-trainer-and-fitness-assistant.-The-chatbot-has-a-sleek-modern-design-with-a-holographic--1400x800.png"
//const imageLink = "https://gadgetuser.com/wp-content/uploads/2022/07/Atlis-Movement-Home-AI-Personal-Trainer.jpg.webp"
const Home = () => {
    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
            <WhyChooseSection />
            <CallToAction />
            <TestimonialsSection />
        </div>
    );
};




const HeroSection = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const controls = useAnimation();

    const images = [
        "https://gadgetuser.com/wp-content/uploads/2022/07/Atlis-Movement-Home-AI-Personal-Trainer.jpg.webp",
        "https://gadgetuser.com/wp-content/uploads/2022/07/Atlis-Movement-AI-Personal-Trainer.jpg.webp",
        "https://cdn.trendhunterstatic.com/phpthumbnails/465/465490/465490_3_800.jpeg"
    ];

    const headlines = [
        "Transform Your Fitness Journey",
        "Fuel Your Body, Feed Your Soul",
        "Elevate Your Wellness Game"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            controls.start({ opacity: [0, 1], transition: { duration: 1 } });
        }, 5000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative h-screen flex items-center justify-center text-center overflow-hidden"
        >
            {images.map((src, index) => (
                <motion.div
                    key={src}
                    initial={{ opacity: 0 }}
                    animate={imageIndex === index ? { opacity: 0.5 } : { opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <img
                        src={src}
                        alt={`Fitness Background ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/30 z-10"></div>

            <div className="relative z-20 max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-blue-400 text-xl font-semibold mb-4">Welcome to FitVision</h2>
                    <motion.h1
                        animate={controls}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        {headlines[imageIndex]}
                        <span className="text-blue-400">.</span>
                    </motion.h1>
                </motion.div>

                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
                >
                    Experience the future of fitness with FitVision - your AI-powered personal trainer, nutritionist, and wellness coach, all in one revolutionary app.
                </motion.p>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 flex items-center"
                    >
                        Start Your Free Trial
                        <ChevronRight className="ml-2" size={20} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 flex items-center"
                    >
                        Watch Demo
                        <Play className="ml-2" size={20} />
                    </motion.button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2 z-20"
            >
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${imageIndex === index ? 'bg-blue-400' : 'bg-gray-400'
                            }`}
                    />
                ))}
            </motion.div>
        </motion.section>
    );
};



const FeaturesSection = () => {
    const features = [
        { icon: <Activity size={40} />, title: "Personalized Workouts", description: "AI-generated exercise plans tailored to your goals and fitness level." },
        { icon: <ChefHat size={40} />, title: "Custom Meal Plans", description: "Nutrition advice and meal suggestions based on your dietary needs and preferences." },
        { icon: <Camera size={40} />, title: "Posture Analysis", description: "Real-time feedback on your form to prevent injuries and maximize results." },
        { icon: <Heart size={40} />, title: "Health Tracking", description: "Monitor your progress with comprehensive health and fitness metrics." },
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
            <div className="max-w-6xl mx-auto px-4 ">
                <h2 className="text-3xl font-bold text-center mb-12">Revolutionize Your Fitness</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-800 p-6 rounded-lg text-center"
                        >
                            <div className="text-blue-400 mb-4 flex justify-center">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PricingSection = () => {
    const plans = [
        { name: "Basic", price: "$9.99", features: ["Personalized workout plans", "Basic meal suggestions", "Progress tracking"] },
        { name: "Pro", price: "$19.99", features: ["Everything in Basic", "Advanced posture analysis", "Nutritionist consultation", "24/7 support"] },
        { name: "Elite", price: "$29.99", features: ["Everything in Pro", "1-on-1 virtual coaching", "Custom meal prep service", "Premium content access"] },
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-800 p-8 rounded-lg text-center"
                        >
                            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                            <p className="text-4xl font-bold text-blue-400 mb-6">{plan.price}<span className="text-lg text-gray-400">/month</span></p>
                            <ul className="text-left mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center mb-2">
                                        <Check size={20} className="text-green-400 mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const WhyChooseSection = () => {
    const reasons = [
        { icon: <Zap size={30} />, title: "AI-Powered Personalization", description: "Our advanced algorithms create truly personalized fitness experiences." },
        { icon: <Activity size={30} />, title: "Holistic Approach", description: "We combine exercise, nutrition, and wellness for comprehensive results." },
        { icon: <Camera size={30} />, title: "Cutting-Edge Technology", description: "Utilize computer vision for real-time posture and form correction." },
        { icon: <Heart size={30} />, title: "Expert-Backed Content", description: "All our programs are developed and verified by fitness professionals." },
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose FitVision?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-start"
                        >
                            <div className="text-blue-400 mr-4 mt-1">{reason.icon}</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                                <p className="text-gray-300">{reason.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { name: "Sarah L.", quote: "FitVision has completely transformed my approach to fitness. The personalized workouts and nutrition advice are game-changers!" },
        { name: "Mike R.", quote: "As a busy professional, FitVision's flexibility and AI-powered guidance have made staying fit so much easier. Highly recommended!" },
        { name: "Emma T.", quote: "The posture analysis feature has helped me correct my form and prevent injuries. It's like having a personal trainer 24/7!" },
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-800 p-6 rounded-lg"
                        >
                            <p className="text-gray-300 mb-4">&quot;{testimonial.quote}&quot;</p>
                            <div className="flex items-center">
                                <Star className="text-yellow-400 mr-1" size={20} />
                                <Star className="text-yellow-400 mr-1" size={20} />
                                <Star className="text-yellow-400 mr-1" size={20} />
                                <Star className="text-yellow-400 mr-1" size={20} />
                                <Star className="text-yellow-400 mr-1" size={20} />
                            </div>
                            <p className="font-semibold mt-2">{testimonial.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CallToAction = () => (
    <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h2>
            <p className="text-xl mb-8">Join FitVision today and experience the future of personalized fitness.</p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg transition duration-300 hover:bg-gray-100"
            >
                Start Your Free Trial Now
            </motion.button>
        </div>
    </section>
);

export default Home;