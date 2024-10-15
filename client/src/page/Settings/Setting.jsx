/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

//const imgLink = "https://media.licdn.com/dms/image/D5612AQGR7Ysju7KaKw/article-cover_image-shrink_720_1280/0/1700207000877?e=2147483647&v=beta&t=JUkpFrutYC_hl0z7gnW2SO7I_AO7QL8x0UYX1iGbL9I";

const InputField = ({ label, type, name, value, onChange, placeholder, options }) => (
    <motion.div
        className="mb-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <label htmlFor={name} className="block text-sm font-medium text-blue-300 mb-1">{label}</label>
        {type === 'select' ? (
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-gray-700"
            >
                <option value="">Select an option</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-gray-700"
            />
        )}
        <motion.div
            className="absolute right-3 top-9 text-blue-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
        </motion.div>
    </motion.div>
);

const Setting = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        height: '',
        weight: '',
        goal: '',
        dietType: '',
        nationality: '',
        location: '',
        preferredFood: '',
        allergies: '',
        activityLevel: '',
        sleepHours: '',
        stressLevel: '',
        waterIntake: '',
        mealFrequency: '',
        medicalConditions: '',
        supplements: '',
        fitnessGoals: '',
    });
    const [isSaved, setIsSaved] = useState(false);
    const [activeQuote, setActiveQuote] = useState(0);

    const quotes = [
        "The greatest wealth is health.",
        "Take care of your body. It's the only place you have to live.",
        "Your health is an investment, not an expense.",
        "The first wealth is health.",
        "Healthy citizens are the greatest asset any country can have."
    ];

    useEffect(() => {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }

        const quoteInterval = setInterval(() => {
            setActiveQuote((prev) => (prev + 1) % quotes.length);
        }, 5000);

        return () => clearInterval(quoteInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('userSettings', JSON.stringify(formData));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        navigate('/profile');
    };

    const goalOptions = ['Weight loss', 'Muscle gain', 'Maintain weight', 'Improve overall health'];
    const dietTypeOptions = ['Balanced', 'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Mediterranean'];
    const activityLevelOptions = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Extremely active'];
    const stressLevelOptions = ['Low', 'Moderate', 'High'];
    const mealFrequencyOptions = ['2 meals', '3 meals', '4 meals', '5 meals', '6+ meals'];
    const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
    const fitnessGoalOptions = ['Increase endurance', 'Build muscle', 'Improve flexibility', 'Enhance overall fitness'];

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
            >
                <div className="px-6 py-8 bg-indigo-600 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-white">User Settings</h2>
                    </div>
                    <motion.div
                        className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500 rounded-full opacity-20"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 10,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            repeat: Infinity,
                        }}
                    />
                </div>
                <div className="px-6 py-4 bg-gray-700 text-sm text-blue-300">
                    <motion.p
                        key={activeQuote}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="italic text-center text-lg"
                    >
                        "{quotes[activeQuote]}"
                    </motion.p>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-8">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                        <InputField label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter your age" />
                        <InputField label="Gender" type="select" name="gender" value={formData.gender} onChange={handleChange} options={genderOptions} />
                        <InputField label="Height (cm)" type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Enter your height" />
                        <InputField label="Weight (kg)" type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter your weight" />
                        <InputField label="Goal" type="select" name="goal" value={formData.goal} onChange={handleChange} options={goalOptions} />
                        <InputField label="Diet Type" type="select" name="dietType" value={formData.dietType} onChange={handleChange} options={dietTypeOptions} />
                        <InputField label="Nationality (Optional)" type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Enter your nationality" />
                        <InputField label="Location (Optional)" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter your location" />
                        <InputField label="Preferred Food" type="text" name="preferredFood" value={formData.preferredFood} onChange={handleChange} placeholder="Enter your food preferences" />
                        <InputField label="Allergies" type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Enter any allergies" />
                        <InputField label="Activity Level" type="select" name="activityLevel" value={formData.activityLevel} onChange={handleChange} options={activityLevelOptions} />
                        <InputField label="Sleep Hours" type="number" name="sleepHours" value={formData.sleepHours} onChange={handleChange} placeholder="Enter average sleep hours" />
                        <InputField label="Stress Level" type="select" name="stressLevel" value={formData.stressLevel} onChange={handleChange} options={stressLevelOptions} />
                        <InputField label="Water Intake (L)" type="number" name="waterIntake" value={formData.waterIntake} onChange={handleChange} placeholder="Enter daily water intake" />
                        <InputField label="Meal Frequency" type="select" name="mealFrequency" value={formData.mealFrequency} onChange={handleChange} options={mealFrequencyOptions} />
                        <InputField label="Medical Conditions" type="text" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="Enter any medical conditions" />
                        <InputField label="Supplements" type="text" name="supplements" value={formData.supplements} onChange={handleChange} placeholder="Enter any supplements you take" />
                        <InputField label="Fitness Goals" type="select" name="fitnessGoals" value={formData.fitnessGoals} onChange={handleChange} options={fitnessGoalOptions} />
                    </div>
                    <div className="mt-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                        >
                            <Save className="mr-2" size={24} />
                            Save Settings
                        </motion.button>
                    </div>
                </form>
                <motion.div
                    className="px-6 py-4 bg-gray-700 text-sm text-blue-300 flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Info className="mr-2" size={20} />
                    Your data is saved locally and is not shared with us or any third parties.
                </motion.div>
                <AnimatePresence>
                    {isSaved && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
                        >
                            <CheckCircle className="mr-2" size={20} />
                            Settings saved successfully!
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

        </div>
    );
};

export default Setting;