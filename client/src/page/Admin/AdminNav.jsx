
import { Link, useLocation } from 'react-router-dom';

const AdminNavBar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-700' : '';
    };

    return (
        <nav className="bg-gray-900 text-white p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold">FitVision Admin</Link>
                    <div className="flex space-x-4">
                        <Link 
                            to="/admin/log" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out ${isActive('/admin/log')}`}
                        >
                            Admin Log
                        </Link>
                        <Link 
                            to="/admin/reqperuser" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out ${isActive('/admin/reqperuser')}`}
                        >
                            Requests Per User
                        </Link>
                        <Link 
                            to="/admin/progressreport" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out ${isActive('/admin/progressreport')}`}
                        >
                            Progress Report
                        </Link>
                        <Link 
                            to="/admin/massmail" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition duration-150 ease-in-out ${isActive('/admin/massmail')}`}
                        >
                            Send Mass Mail
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar;