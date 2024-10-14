import { FaGoogle } from 'react-icons/fa';

const Oauth = () => {
    return (
        <div className="flex justify-center items-center ">
            <button
                className="flex items-center w-full justify-center gap-2 px-6 py-3 text-gray-700 font-semibold bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-100 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
                <FaGoogle className="w-6 h-6 text-red-500" />
                Continue with Google
            </button>
        </div>
    );
};

export default Oauth;
