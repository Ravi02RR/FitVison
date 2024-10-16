import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

const AdminLog = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/v1/admin/users', {
                headers: { 'admintoken': adminToken }
            });
            setUsers(res.data.users);
            setFilteredUsers(res.data.users);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        }
    };

    const handleEdit = async (userId) => {
        try {
            const res = await axios.get(`/api/v1/admin/users/${userId}`, {
                headers: { 'admintoken': adminToken }
            });
            setSelectedUser(res.data.user);
            setIsEditing(true);
        } catch (err) {
            setError('Failed to fetch user details');
            console.error(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

            const updatedUser = {
                username: selectedUser.username,
                email: selectedUser.email,
                firstname: selectedUser.firstname,
                lastname: selectedUser.lastname,
                isPro: selectedUser.isPro === 'true',
                proExpirationDate: selectedUser.proExpirationDate || null
            };


            Object.keys(updatedUser).forEach(key =>
                (updatedUser[key] === undefined || updatedUser[key] === '') && delete updatedUser[key]
            );

            const res = await axios.put(`/api/v1/admin/users/${selectedUser._id}`, updatedUser, {
                headers: { 'admintoken': adminToken }
            });
            setUsers(users.map(user => user._id === selectedUser._id ? res.data.user : user));
            setIsEditing(false);
            setSelectedUser(null);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = err.response.data.errors.map(e => e.message).join(', ');
                setError(`Failed to update user: ${errorMessages}`);
            } else {
                setError('Failed to update user: ' + (err.response?.data?.message || err.message));
            }
            console.error(err);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/v1/admin/users/${userId}`, {
                    headers: { 'admintoken': adminToken }
                });
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                setError('Failed to delete user');
                console.error(err);
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSelectedUser({ ...selectedUser, [e.target.name]: value });
    };

    const formatDate = (date) => {
        return date ? format(new Date(date), 'PPP') : 'N/A';
    };

    return (
        <div className="container mx-auto p-4 min-h-screen ">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <div className="mb-4 flex items-center">
                <Search className="mr-2" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Pro Status</th>
                        <th className="py-2 px-4 border-b">Subscription Expires</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td className="py-2 px-4 border-b">{user.username}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">{`${user.firstname} ${user.lastname}`}</td>
                            <td className="py-2 px-4 border-b">{user.isPro ? 'Pro' : 'Basic'}</td>
                            <td className="py-2 px-4 border-b">{formatDate(user.proExpirationDate)}</td>
                            <td className="py-2 px-4 border-b">
                                <button onClick={() => handleEdit(user._id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditing && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h2 className="text-lg font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={selectedUser.username}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={selectedUser.firstname}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={selectedUser.lastname}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Pro Status:</label>
                                <select
                                    name="isPro"
                                    value={selectedUser.isPro}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value={true}>Pro</option>
                                    <option value={false}>Basic</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Pro Expiration Date:</label>
                                <input
                                    type="date"
                                    name="proExpirationDate"
                                    value={selectedUser.proExpirationDate ? selectedUser.proExpirationDate.split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Update
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLog;