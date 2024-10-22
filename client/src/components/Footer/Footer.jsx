import { useState } from 'react';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/v1/subs', { email });
      console.log(response)
      setMessage('Successfully subscribed!');
      setEmail('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-gray-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                    About
                  </h3>
                  <ul className="space-y-2">
                    {['Our Story', 'Team', 'Careers'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base hover:text-white transition duration-150 ease-in-out">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                    Support
                  </h3>
                  <ul className="space-y-2">
                    {['FAQ', 'Contact', 'Privacy Policy'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base hover:text-white transition duration-150 ease-in-out">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Subscribe to our newsletter
              </h3>
              <p className="text-base text-gray-300 mb-4">
                Get the latest news and updates from FitVision.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:mr-2 flex-grow"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {message && (
                <p className={`mt-2 text-sm ${message.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">{social}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
            <p className="text-base text-gray-400">
              &copy; 2024 FitVision. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;