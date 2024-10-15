import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/Private/PrivateRoute';
import PublicRoute from './components/Private/PublicRoute';

// Pages
import Home from './page/Home/Home';
import About from './page/About/About';
import Signin from './page/auth/Signin';
import Signup from './page/auth/Signup';
import Profile from './page/Profile/Profile';
import ForgetPassword from './page/auth/ForgetPassword';
import ResetPassword from './page/auth/ResetPassword';
import AdminLog from './page/Admin/AdminLog';
import Setting from './page/Settings/Setting';
import Progress from './page/Progress/Progress';
import Pro from './page/Plans/Pro';
import Paymentsucess from './page/Plans/Paymentsucess';
import ProRoute from './components/Private/ProRoute';
import PoseEstimation from './page/PoseEstimation/PoseEstimation';

function NotFound() {
  return (
    <div className='min-h-screen bg-gray-900 flex justify-center items-center'>
      <h1 className='text-4xl font-bold text-red-600'>404 Not Found</h1>
    </div>
  );
}

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/signin"
            element={
              <PublicRoute user={user}>
                <Signin />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute user={user}>
                <Signup />
              </PublicRoute>
            }
          />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route path="/forget-password" element=
            {
              <PublicRoute user={user}>
                <ForgetPassword />
              </PublicRoute>

            } />
          <Route path="/reset-password/:token" element=
            {
              <PublicRoute user={user}>
                <ResetPassword />
              </PublicRoute>

            } />

          <Route path="/pose"
            element={
              <ProRoute user={user}>
                <PoseEstimation />
              </ProRoute>
            }
          />



          <Route path="/admin/log" element={<PrivateRoute element={AdminLog} />} />
          <Route path="/settings" element={<PrivateRoute element={Setting} />} />
          <Route path="/progress" element={<PrivateRoute element={Progress} />} />
          <Route path="/paymentsuccess" element={<PrivateRoute element={Paymentsucess} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/pro" element={<Pro />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;