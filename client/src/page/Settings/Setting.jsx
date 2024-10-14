import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Info, CheckCircle } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const InputField = ({ label, type, name, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-blue-300 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

const Setting = () => {
    const [formData, setFormData] = useState({
        age: '',
        height: '',
        weight: '',
        goal: '',
        dietType: '',
        nationality: '',
        location: '',
        preferredFood: '',
        allergies: '',
        activityLevel: '',
    });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
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
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            >
                <div className="px-4 py-5 sm:px-6 bg-indigo-600">
                    <h2 className="text-2xl leading-6 font-bold text-white">User Settings</h2>
                </div>
                <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <InputField label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter your age" />
                        <InputField label="Height (cm)" type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Enter your height" />
                        <InputField label="Weight (kg)" type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter your weight" />
                        <InputField label="Goal" type="text" name="goal" value={formData.goal} onChange={handleChange} placeholder="E.g., Weight loss, Muscle gain" />
                        <InputField label="Diet Type" type="text" name="dietType" value={formData.dietType} onChange={handleChange} placeholder="E.g., Vegan, Keto, Balanced" />
                        <InputField label="Nationality (Optional)" type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Enter your nationality" />
                        <InputField label="Location (Optional)" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter your location" />
                        <InputField label="Preferred Food" type="text" name="preferredFood" value={formData.preferredFood} onChange={handleChange} placeholder="Enter your food preferences" />
                        <InputField label="Allergies" type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Enter any allergies" />
                        <InputField label="Activity Level" type="text" name="activityLevel" value={formData.activityLevel} onChange={handleChange} placeholder="E.g., Sedentary, Moderate, Active" />
                    </div>
                    <div className="mt-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Save className="mr-2" size={20} />
                            Save Settings
                        </motion.button>
                    </div>
                </form>
                <div className="px-4 py-3 bg-gray-700 text-sm text-blue-300 flex items-center">
                    <Info className="mr-2" size={20} />
                    Your data is saved locally and is not shared with us or any third parties.
                </div>
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
            </motion.div>
        </div>
    );
};

export default Setting;