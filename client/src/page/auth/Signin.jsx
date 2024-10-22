import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFail } from '../../redux/user/userSlice';
import Oauth from '../../components/oAuth/Oauth';

const Signin = () => {
  const inputRef = useRef(null)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    inputRef.current.focus()

  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    dispatch(signInStart());

    try {
      const response = await axios.post('/api/v1/auth/signin', formData);
      setSuccess(response.data.message);
      setFormData({ email: '', password: '' });
      dispatch(signInSuccess(response.data.user));
      navigate('/');
    } catch (err) {
      dispatch(signInFail(err.response?.data?.message || 'An error occurred during sign-in'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-2xl"
      >
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-blue-300">Sign in</h2>
          <p className="mt-2 text-center text-sm text-gray-400">Join us and start your journey</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px gap-4">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                ref={inputRef}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>

          </div>
        </form>
        <Oauth />
        <div>
          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-300 hover:text-blue-400">Sign up</Link>
          </p>
          <p className="text-center text-sm text-gray-400">
            <Link to="/forget-password" className="font-medium text-blue-300 hover:text-blue-400">Forget password?</Link>
          </p>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-green-400 bg-green-900 bg-opacity-50 p-3 rounded-md"
          >
            {success}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Signin;
