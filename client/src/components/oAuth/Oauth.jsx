import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { FireBaseapp } from '../../firebase/Firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice.js';


const Oauth = () => {
    const dispatch = useDispatch();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(FireBaseapp);

        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL
                })
            })
            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));

        } catch (err) {
            console.error("Login failed:", err);
            alert("Google login failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center">
            <button
                type='button'
                onClick={handleGoogleLogin}
                className="flex items-center w-full justify-center gap-2 px-6 py-3 text-gray-700 font-semibold bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-100 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
                <FaGoogle className="w-6 h-6 text-red-500" />
                Continue with Google
            </button>
        </div>
    );
};

export default Oauth;
