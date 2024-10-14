import  { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaDumbbell, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => setIsOpen(!isOpen);

    const navItems = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/signin', label: 'SignIn' },
    
    ];

    return (
        <nav className="bg-gradient-to-r from-gray-900 to-blue-900 p-4 w-full  z-50 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-3xl font-bold text-white hover:text-blue-400 transition-colors duration-300">
                    <FaDumbbell className="text-blue-400" />
                    <span>FitVision</span>
                </Link>

                <div className="hidden lg:flex space-x-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `text-lg font-semibold ${isActive ? 'text-blue-400' : 'text-white'
                                } hover:text-blue-300 transition-colors duration-300`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
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
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={toggleNavbar}
                                    className={({ isActive }) =>
                                        `text-2xl font-bold my-4 ${isActive ? 'text-blue-400' : 'text-white'
                                        } hover:text-blue-300 transition-colors duration-300`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;