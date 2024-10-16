import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const ProgressReport = () => {
    const [overallStats, setOverallStats] = useState(null);
    const [weightLossLeaderboard, setWeightLossLeaderboard] = useState([]);
    const [streakLeaderboard, setStreakLeaderboard] = useState([]);
    const [progressDistribution, setProgressDistribution] = useState(null);
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTokenValid, setIsTokenValid] = useState(true);

    const TOKEN_EXPIRY_TIME = 2 * 60 * 60 * 1000;

    useEffect(() => {
        const checkAndFetchData = async () => {
            let adminToken = localStorage.getItem('adminToken');
            let tokenTime = localStorage.getItem('tokenTime');
            const currentTime = new Date().getTime();

            const clearToken = () => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('tokenTime');
                setIsTokenValid(false);
            };

            if (adminToken && tokenTime) {
                const timeDifference = currentTime - parseInt(tokenTime);
                if (timeDifference > TOKEN_EXPIRY_TIME) {
                    clearToken();
                    return;
                }
            } else {
                clearToken();
                return;
            }

            try {
                setLoading(true);
                const headers = {
                    'admintoken': adminToken
                };
                const fetchOptions = {
                    headers: headers
                };

                const [overallStatsRes, weightLossLeaderboardRes, streakLeaderboardRes, progressDistributionRes, monthlyTrendsRes] = await Promise.all([
                    fetch('/api/v1/progressReport/overall-stats', fetchOptions),
                    fetch('/api/v1/progressReport/leaderboard/weight-loss', fetchOptions),
                    fetch('/api/v1/progressReport/leaderboard/streak', fetchOptions),
                    fetch('/api/v1/progressReport/progress-distribution', fetchOptions),
                    fetch('/api/v1/progressReport/monthly-trends', fetchOptions)
                ]);

                if (!overallStatsRes.ok || !weightLossLeaderboardRes.ok || !streakLeaderboardRes.ok || !progressDistributionRes.ok || !monthlyTrendsRes.ok) {
                    throw new Error('One or more API requests failed');
                }

                const overallStatsData = await overallStatsRes.json();
                const weightLossLeaderboardData = await weightLossLeaderboardRes.json();
                const streakLeaderboardData = await streakLeaderboardRes.json();
                const progressDistributionData = await progressDistributionRes.json();
                const monthlyTrendsData = await monthlyTrendsRes.json();

                setOverallStats(overallStatsData);
                setWeightLossLeaderboard(weightLossLeaderboardData);
                setStreakLeaderboard(streakLeaderboardData);
                setProgressDistribution(progressDistributionData);
                setMonthlyTrends(monthlyTrendsData);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.message === 'One or more API requests failed') {
                    clearToken();
                } else {
                    setError('An error occurred while fetching data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAndFetchData();
    }, []);

    const handleTokenSubmit = (event) => {
        event.preventDefault();
        const newToken = event.target.elements.token.value;
        if (newToken) {
            localStorage.setItem('adminToken', newToken);
            localStorage.setItem('tokenTime', new Date().getTime().toString());
            setIsTokenValid(true);
            window.location.reload(); 
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            },
            title: {
                display: true,
                text: 'Chart Title',
                color: 'white'
            },
        },
        scales: {
            x: {
                ticks: { color: 'white' }
            },
            y: {
                ticks: { color: 'white' }
            }
        }
    };

    const pieChartData = {
        labels: ['Users Tracking Progress', 'Users Not Tracking'],
        datasets: [
            {
                data: overallStats ? [overallStats.usersTrackingProgress, overallStats.totalUsers - overallStats.usersTrackingProgress] : [],
                backgroundColor: ['#4CAF50', '#FFA000'],
            },
        ],
    };

    const weightLossChartData = {
        labels: weightLossLeaderboard.map(user => user.username),
        datasets: [
            {
                label: 'Weight Loss (kg)',
                data: weightLossLeaderboard.map(user => user.weightLoss),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const streakChartData = {
        labels: streakLeaderboard.map(user => user.username),
        datasets: [
            {
                label: 'Streak (days)',
                data: streakLeaderboard.map(user => user.streak),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
        ],
    };

    const monthlyTrendsChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Average Weight Loss',
                data: monthlyTrends.map(month => month.totalWeightLoss / month.activeUsers),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const progressDistributionChartData = progressDistribution ? {
        labels: Object.keys(progressDistribution.weightLossRanges),
        datasets: [
            {
                label: 'Weight Loss Distribution',
                data: Object.values(progressDistribution.weightLossRanges),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    } : null;

    if (!isTokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-8 flex items-center justify-center">
                <form onSubmit={handleTokenSubmit} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Enter Admin Token</h2>
                    <input
                        type="password"
                        name="token"
                        placeholder="Admin Token"
                        className="w-full p-2 mb-4 text-black rounded"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Submit
                    </button>
                </form>
            </div>
        );
    }

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Progress Report</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {overallStats && (
                    <motion.div
                        className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Overall Stats</h2>
                        <p>Total Users: {overallStats.totalUsers}</p>
                        <p>Users Tracking Progress: {overallStats.usersTrackingProgress}</p>
                        <p>Average Weight Loss: {overallStats.averageWeightLoss.toFixed(2)} kg</p>
                        <div className="h-64 mt-4">
                            <Pie data={pieChartData} options={chartOptions} />
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Weight Loss Leaderboard</h2>
                    <div className="h-64">
                        <Bar data={weightLossChartData} options={chartOptions} />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Streak Leaderboard</h2>
                    <div className="h-64">
                        <Bar data={streakChartData} options={chartOptions} />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Monthly Trends</h2>
                    <div className="h-64">
                        <Line data={monthlyTrendsChartData} options={chartOptions} />
                    </div>
                </motion.div>

                {progressDistribution && (
                    <motion.div
                        className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Weight Loss Distribution</h2>
                        <div className="h-64">
                            <Pie data={progressDistributionChartData} options={chartOptions} />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProgressReport;