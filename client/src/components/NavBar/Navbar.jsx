import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaDumbbell, FaTimes, FaUser, FaCog, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import { signOutSuccess } from '../../redux/user/userSlice.js';
import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isPlannerDropdownOpen, setIsPlannerDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const plannerDropdownRef = useRef(null);

    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const toggleNavbar = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        await axios.post('/api/v1/auth/signout');
        dispatch(signOutSuccess());
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const togglePlannerDropdown = () => setIsPlannerDropdownOpen(!isPlannerDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (plannerDropdownRef.current && !plannerDropdownRef.current.contains(event.target)) {
                setIsPlannerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = user
        ? [
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/progress', label: 'Progress' },
            {
                label: 'Planner',
                dropdown: [
                    { to: '/dietplanner', label: 'Diet Planner' },
                    { to: '/exerciseplanner', label: 'Exercise' }
                ]
            },
        ]
        : [
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/signin', label: 'SignIn' },
            { to: '/signup', label: 'SignUp' }
        ];

    return (
        <nav className="bg-gradient-to-r from-gray-900 to-blue-900 p-4 w-full z-50 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-3xl font-bold text-white hover:text-blue-400 transition-colors duration-300">
                    <FaDumbbell className="text-blue-400" />
                    <span>FitVision</span>
                </Link>

                <div className="hidden lg:flex space-x-6 items-center">
                    {navItems.map((item, index) => (
                        item.dropdown ? (
                            <div key={index} className="relative" ref={plannerDropdownRef}>
                                <button
                                    onClick={togglePlannerDropdown}
                                    className="text-lg font-semibold text-white hover:text-blue-300 transition-colors duration-300 flex items-center"
                                >
                                    {item.label}
                                    <FaCaretDown className="ml-1" />
                                </button>
                                <AnimatePresence>
                                    {isPlannerDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10"
                                        >
                                            {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                                <Link
                                                    key={dropdownIndex}
                                                    to={dropdownItem.to}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                                    onClick={() => setIsPlannerDropdownOpen(false)}
                                                >
                                                    {dropdownItem.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <NavLink
                                key={index}
                                to={item.to}
                                className={({ isActive }) =>
                                    `text-lg font-semibold ${isActive ? 'text-blue-400' : 'text-white'
                                    } hover:text-blue-300 transition-colors duration-300`
                                }
                            >
                                {item.label}
                            </NavLink>
                        )
                    ))}
                    {user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <FaUser className="text-white text-xl" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl py-2 z-10"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm font-semibold text-gray-700">{user.name || 'User'}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <Link to="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                                            <FaUser className="mr-3 text-blue-500" />
                                            Your Profile
                                        </Link>
                                        <Link to="/settings" className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                                            <FaCog className="mr-3 text-blue-500" />
                                            Settings
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                                            <FaSignOutAlt className="mr-3 text-blue-500" />
                                            Sign out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <button
                    onClick={toggleNavbar}
                    className="lg:hidden text-white hover:text-blue-400 transition-colors duration-300 z-50"
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-40"
                    >
                        <div className="flex flex-col items-center justify-center h-full">
                            {navItems.map((item, index) => (
                                item.dropdown ? (
                                    <React.Fragment key={index}>
                                        {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                            <NavLink
                                                key={`${index}-${dropdownIndex}`}
                                                to={dropdownItem.to}
                                                onClick={toggleNavbar}
                                                className={({ isActive }) =>
                                                    `text-2xl font-bold my-4 ${isActive ? 'text-blue-400' : 'text-white'
                                                    } hover:text-blue-300 transition-colors duration-300`
                                                }
                                            >
                                                {dropdownItem.label}
                                            </NavLink>
                                        ))}
                                    </React.Fragment>
                                ) : (
                                    <NavLink
                                        key={index}
                                        to={item.to}
                                        onClick={toggleNavbar}
                                        className={({ isActive }) =>
                                            `text-2xl font-bold my-4 ${isActive ? 'text-blue-400' : 'text-white'
                                            } hover:text-blue-300 transition-colors duration-300`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                )
                            ))}
                            {user && (
                                <>
                                    <NavLink
                                        to="/profile"
                                        onClick={toggleNavbar}
                                        className="text-2xl font-bold my-4 text-white hover:text-blue-300 transition-colors duration-300"
                                    >
                                        Profile
                                    </NavLink>
                                    <NavLink
                                        to="/settings"
                                        onClick={toggleNavbar}
                                        className="text-2xl font-bold my-4 text-white hover:text-blue-300 transition-colors duration-300"
                                    >
                                        Settings
                                    </NavLink>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleNavbar();
                                        }}
                                        className="text-2xl font-bold my-4 text-white hover:text-blue-300 transition-colors duration-300"
                                    >
                                        Sign out
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;