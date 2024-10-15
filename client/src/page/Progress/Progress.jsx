import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FaDumbbell } from 'react-icons/fa';
import axios from 'axios';
import 'chart.js/auto';

const Progress = () => {
    const [progressData, setProgressData] = useState([]);
    const [streak, setStreak] = useState(0);
    const [weightLoss, setWeightLoss] = useState(0);
    const [bmiStatus, setBmiStatus] = useState('Normal');
    const [formData, setFormData] = useState({
        currentWeight: '',
        targetWeight: '',
        height: '',
    });

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await axios.get('/api/v1/progress');
            const { progress } = response.data;
            console.log(progress);
            setProgressData(progress.entries);
            setStreak(progress.streak);
            setWeightLoss(parseFloat(progress.weightLossPercentage) || 0);
            if (progress.entries.length > 0) {
                const lastEntry = progress.entries[progress.entries.length - 1];
                setBmiStatus(lastEntry.status);
            }
        } catch (err) {
            console.error('Failed to fetch progress data:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/progress', formData);
            fetchProgress();
            setFormData({ currentWeight: '', targetWeight: '', height: '' });
        } catch (err) {
            console.error('Failed to add progress:', err);
        }
    };

    const chartData = {
        labels: progressData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Weight (kg)',
                data: progressData.map(item => item.currentWeight),
                borderColor: '#60A5FA',
                backgroundColor: 'rgba(96, 165, 250, 0.3)',
                tension: 0.4,
            },
            {
                label: 'Target Weight (kg)',
                data: progressData.map(item => item.targetWeight),
                borderColor: '#34D399',
                backgroundColor: 'rgba(52, 211, 153, 0.3)',
                tension: 0.4,
            }
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Weight (kg)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toFixed(2) + ' kg';
                        }
                        return label;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-900 to-blue-900 min-h-screen text-white">
            <motion.div
                className="container mx-auto py-12 px-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">Progress Dashboard</h1>
                    <FaDumbbell className="text-blue-400 text-4xl" />
                </div>

                <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Add Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            name="currentWeight"
                            value={formData.currentWeight}
                            onChange={handleInputChange}
                            placeholder="Current Weight (kg)"
                            className="p-2 rounded bg-gray-700 text-white"
                            required
                        />
                        <input
                            type="number"
                            name="targetWeight"
                            value={formData.targetWeight}
                            onChange={handleInputChange}
                            placeholder="Target Weight (kg)"
                            className="p-2 rounded bg-gray-700 text-white"
                            required
                        />
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            placeholder="Height (cm)"
                            className="p-2 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Progress
                    </button>
                </form>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold">Streak</h2>
                        <motion.div
                            className="text-6xl font-bold mt-4"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror' }}
                        >
                            {streak}
                        </motion.div>
                        <p className="text-gray-400">Days of progress streak</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold">Weight Loss</h2>
                        <motion.div
                            className="text-6xl font-bold mt-4 text-green-400"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror' }}
                        >
                            {weightLoss}%
                        </motion.div>
                        <p className="text-gray-400">Overall weight loss percentage</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold">BMI Status</h2>
                        <div className="text-5xl font-bold mt-4 text-yellow-400">{bmiStatus}</div>
                        <p className="text-gray-400">Current BMI category</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Detailed Progress</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs uppercase bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Current Weight (kg)</th>
                                    <th className="px-6 py-3">Target Weight (kg)</th>
                                    <th className="px-6 py-3">Height (cm)</th>
                                    <th className="px-6 py-3">BMI</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progressData.map((entry, index) => (
                                    <tr key={index} className="bg-gray-800 border-b border-gray-700">
                                        <td className="px-6 py-4">{new Date(entry.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{entry.currentWeight.toFixed(2)}</td>
                                        <td className="px-6 py-4">{entry.targetWeight.toFixed(2)}</td>
                                        <td className="px-6 py-4">{entry.height.toFixed(2)}</td>
                                        <td className="px-6 py-4">{entry.BMI.toFixed(2)}</td>
                                        <td className="px-6 py-4">{entry.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Weight Progress Visualization</h2>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </motion.div>
        </div>
    );
};

export default Progress;