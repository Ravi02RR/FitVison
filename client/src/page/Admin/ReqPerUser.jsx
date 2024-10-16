/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { motion } from 'framer-motion';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const ReqPerUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState('total');
    const [order, setOrder] = useState('desc');
    const TOKEN_EXPIRY_TIME = 2 * 60 * 60 * 1000;
    let adminToken = localStorage.getItem('adminToken');
    let tokenTime = localStorage.getItem('tokenTime');
    const currentTime = new Date().getTime();
    const clearToken = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('tokenTime');
        console.log("Token expired and removed from localStorage.");
    };
    if (adminToken && tokenTime) {
        const timeDifference = currentTime - tokenTime;
        if (timeDifference > TOKEN_EXPIRY_TIME) {
            clearToken();
            adminToken = null;
        }
    }
    if (!adminToken) {
        adminToken = prompt("Please enter your admin token:");

        if (adminToken) {
            localStorage.setItem('adminToken', adminToken);
            localStorage.setItem('tokenTime', currentTime);
            console.log("Token saved to localStorage with timestamp.");
        } else {
            console.log("No token provided.");
        }
    } else {
        console.log("Token exists in localStorage.");
    }

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, sort, order]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/v1/reqperuser/detailed-stats?page=${page}&limit=10&search=${searchTerm}&sort=${sort}&order=${order}`, {
                headers: { 'admintoken': adminToken }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setError(null);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`/api/v1/reqperuser/request-stats/${userId}`, {
                headers: { 'admintoken': adminToken }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            setSelectedUser(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Failed to load user details. Please try again later.');
        }
    };

    const handleSort = (column) => {
        if (sort === column) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(column);
            setOrder('desc');
        }
    };

    const barChartData = {
        labels: ['Total', 'Success', 'Error'],
        datasets: [
            {
                label: 'Request Statistics',
                data: selectedUser ? [selectedUser.total, selectedUser.success, selectedUser.error] : [],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const pieChartData = {
        labels: ['Success', 'Error'],
        datasets: [
            {
                data: selectedUser ? [selectedUser.success, selectedUser.error] : [],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const lineChartData = {
        labels: selectedUser ? selectedUser.requestDetails.slice(-20).map(detail => new Date(detail.timestamp).toLocaleTimeString()) : [],
        datasets: [
            {
                label: 'Success',
                data: selectedUser ? selectedUser.requestDetails.slice(-20).map(detail => detail.statusCode < 400 ? 1 : 0) : [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Error',
                data: selectedUser ? selectedUser.requestDetails.slice(-20).map(detail => detail.statusCode >= 400 ? 1 : 0) : [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-4 md:p-8">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-8 text-center"
            >
                Request Statistics Dashboard
            </motion.h1>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-500 text-white p-4 rounded mb-4"
                >
                    {error}
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
            >
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-800 rounded-lg p-4 md:p-6 mb-8 shadow-lg overflow-x-auto"
            >
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">Users</h2>
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="text-left border-b border-gray-700">
                            <th className="p-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('username')}>
                                Username <ArrowUpDown className="inline ml-1" size={16} />
                            </th>
                            <th className="p-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('email')}>
                                Email <ArrowUpDown className="inline ml-1" size={16} />
                            </th>
                            <th className="p-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('total')}>
                                Total Requests <ArrowUpDown className="inline ml-1" size={16} />
                            </th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <motion.tr
                                key={user.userId}
                                className="border-b border-gray-700 hover:bg-gray-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="p-3">{user.username}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.total}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => fetchUserDetails(user.userId)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col md:flex-row justify-between items-center mb-8"
            >
                <button
                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                    disabled={page === 1}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-500 transition duration-300 mb-4 md:mb-0"
                >
                    <ChevronUp className="inline mr-2" size={20} /> Previous
                </button>
                <span className="text-xl font-semibold mb-4 md:mb-0">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                    disabled={page === totalPages}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-500 transition duration-300"
                >
                    Next <ChevronDown className="inline ml-2" size={20} />
                </button>
            </motion.div>

            {selectedUser && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg"
                >
                    <h2 className="text-3xl font-semibold mb-6">User Details: {selectedUser.username}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">User Information</h3>
                            <p className="mb-2"><strong>User ID:</strong> {selectedUser.userId}</p>
                            <p className="mb-2"><strong>Email:</strong> {selectedUser.email}</p>
                            <p className="mb-2"><strong>First Name:</strong> {selectedUser.firstname}</p>
                            <p className="mb-2"><strong>Last Name:</strong> {selectedUser.lastname}</p>
                            <p className="mb-2"><strong>Pro User:</strong> {selectedUser.isPro ? 'Yes' : 'No'}</p>
                            {selectedUser.isPro && (
                                <p className="mb-2"><strong>Pro Expiration:</strong> {new Date(selectedUser.proExpirationDate).toLocaleDateString()}</p>
                            )}
                            <p className="mb-2"><strong>First Request:</strong> {new Date(selectedUser.firstRequest).toLocaleString()}</p>
                            <p className="mb-2"><strong>Last Request:</strong> {new Date(selectedUser.lastRequest).toLocaleString()}</p>
                            <p className="mb-2"><strong>IP Addresses:</strong> {selectedUser.ipAddresses.join(', ')}</p>
                            <p className="mb-2"><strong>User Agent:</strong> {selectedUser.userAgent}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">Request Statistics</h3>
                            <div className="mb-6" style={{ height: '250px' }}>
                                <Bar data={barChartData} options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Request Distribution'
                                        }
                                    }
                                }} />
                            </div>
                            <div className="mb-6" style={{ height: '250px' }}>
                                <Pie data={pieChartData} options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Success vs Error Ratio'
                                        }
                                    }
                                }} />
                            </div>
                            <div style={{ height: '250px' }}>
                                <Line data={lineChartData} options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Recent Request Timeline'
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 1
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ReqPerUser;