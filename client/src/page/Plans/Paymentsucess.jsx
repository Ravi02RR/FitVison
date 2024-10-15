import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);


    const reference = searchParams.get('reference') || 'N/A';

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1);
        }, 1000);

        const navigationTimer = setTimeout(() => {
            //set user isPro to true

            navigate('/');
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(navigationTimer);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex items-center justify-center px-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center max-w-md w-full backdrop-blur-sm">
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
                <p className="text-gray-200 mb-6">
                    Thank you for your payment. Your transaction was successful.
                </p>
                <p className="text-gray-300 mb-8">
                    Reference Number: <span className="font-semibold">{reference}</span>
                </p>
                <div className="text-yellow-300 mb-6">
                    Redirecting to home in {countdown} seconds...
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                >
                    Go to Home Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;