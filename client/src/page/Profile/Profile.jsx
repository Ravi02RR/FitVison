/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Mail, Key, Calendar, MapPin, Heart, Apple, Flag, Activity, Edit, User, Weight, Target, Utensils, AlertTriangle, Moon, Droplet, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        className={`bg-gray-800 p-6 rounded-xl shadow-lg ${color} flex flex-col items-center justify-center text-center`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <Icon size={48} className="mb-4" />
        <h3 className="text-xl font-semibold mb-2">{label}</h3>
        <p className="text-2xl font-bold">{value || 'Not specified'}</p>
    </motion.div>
);

const BeautifulProfile = () => {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [localData, setLocalData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            setLocalData(JSON.parse(savedData));
        }
    }, []);

    if (!user) {
        return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex justify-center items-center text-white text-3xl">Loading...</div>;
    }

    const handleEditClick = () => {
        navigate('/settings');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-8"
                >
                    <div className="px-6 py-8 sm:px-10 bg-indigo-600 flex justify-between items-center">
                        <h1 className="text-4xl font-bold text-white">User Profile </h1>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300 flex items-center text-lg font-semibold"
                        >
                            <Edit className="mr-2" size={24} />
                            Edit Profile
                        </motion.button>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                        <ProfileCard icon={UserCircle} label="Name" value={user.name} color="text-white" />
                        <ProfileCard icon={Mail} label="Email" value={user.email} color="text-white" />
                        <ProfileCard icon={Key} label="User ID" value={user.id} color="text-white" />

                        {localData && (


                            <>
                                <ProfileCard icon={Calendar} label="Age" value={`${localData.age} years`} color="text-yellow-400" />
                                <ProfileCard icon={User} label="Gender" value={localData.gender} color="text-pink-400" />
                                <ProfileCard icon={Activity} label="Height" value={localData.height && `${localData.height} cm`} color="text-indigo-400" />
                                <ProfileCard icon={Weight} label="Weight" value={localData.weight && `${localData.weight} kg`} color="text-red-400" />
                                <ProfileCard icon={Target} label="Goal" value={localData.goal} color="text-orange-400" />
                                <ProfileCard icon={Utensils} label="Diet Type" value={localData.dietType} color="text-teal-400" />
                                <ProfileCard icon={Flag} label="Nationality" value={localData.nationality} color="text-blue-400" />
                                <ProfileCard icon={MapPin} label="Location" value={localData.location} color="text-green-400" />
                                <ProfileCard icon={Apple} label="Preferred Food" value={localData.preferredFood} color="text-red-400" />
                                <ProfileCard icon={AlertTriangle} label="Allergies" value={localData.allergies} color="text-yellow-400" />
                                <ProfileCard icon={Activity} label="Activity Level" value={localData.activityLevel} color="text-blue-400" />
                                <ProfileCard icon={Moon} label="Sleep Hours" value={`${localData.sleepHours} hours`} color="text-indigo-400" />
                                <ProfileCard icon={Heart} label="Stress Level" value={localData.stressLevel} color="text-pink-400" />
                                <ProfileCard icon={Droplet} label="Water Intake" value={`${localData.waterIntake} L`} color="text-blue-400" />
                                <ProfileCard icon={Coffee} label="Meal Frequency" value={localData.mealFrequency} color="text-brown-400" />
                                
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BeautifulProfile;