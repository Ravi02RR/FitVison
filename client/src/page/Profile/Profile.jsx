import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Mail, Key, Calendar, MapPin, Heart, Apple, Flag, Activity, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

// eslint-disable-next-line react/prop-types
const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-blue-300 flex items-center">
            <Icon className="mr-2" size={20} />
            {label}
        </dt>
        <dd className="mt-1 text-sm text-blue-300 sm:mt-0 sm:col-span-2">
            {value || 'Not specified'}
        </dd>
    </div>
);

const Profile = () => {
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
        return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex justify-center items-center text-white">Loading...</div>;
    }

    const handleEditClick = () => {
        navigate('/settings');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            >
                <div className="px-4 py-5 sm:px-6 bg-indigo-600 flex justify-between items-center">
                    <h3 className="text-2xl leading-6 font-bold text-white">User Profile</h3>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEditClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 flex items-center"
                    >
                        <Edit className="mr-2" size={18} />
                        Edit Profile
                    </motion.button>
                </div>
                <div className="border-t border-gray-700">
                    <dl className="divide-y divide-gray-700">
                        <ProfileField icon={UserCircle} label="Name" value={user.name} />
                        <ProfileField icon={Mail} label="Email" value={user.email} />
                        <ProfileField icon={Key} label="User ID" value={user.id} />
                        {localData && (
                            <>
                                <ProfileField icon={Calendar} label="Age" value={localData.age} />
                                <ProfileField icon={Activity} label="Height" value={localData.height && `${localData.height} cm`} />
                                <ProfileField icon={Activity} label="Weight" value={localData.weight && `${localData.weight} kg`} />
                                <ProfileField icon={Heart} label="Goal" value={localData.goal} />
                                <ProfileField icon={Apple} label="Diet Type" value={localData.dietType} />
                                <ProfileField icon={Flag} label="Nationality" value={localData.nationality} />
                                <ProfileField icon={MapPin} label="Location" value={localData.location} />
                                <ProfileField icon={Apple} label="Preferred Food" value={localData.preferredFood} />
                                <ProfileField icon={Heart} label="Allergies" value={localData.allergies} />
                                <ProfileField icon={Activity} label="Activity Level" value={localData.activityLevel} />
                            </>
                        )}
                    </dl>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;