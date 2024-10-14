import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//============================Components==============================
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/Private/PrivateRoute';

//==========================elements==========================
import Home from './page/Home/Home';
import About from './page/About/About';
import Signin from './page/auth/Signin';
import Signup from './page/auth/Signup';
import Profile from './page/Profile/Profile';
import ForgetPassword from './page/auth/ForgetPassword';
import ResetPassword from './page/auth/ResetPassword';
import AdminLog from './page/Admin/AdminLog';
import Setting from './page/Settings/Setting';

function NotFound() {
  return (
    <div className='min-h-screen bg-gray-900 flex justify-center items-center'>
      <h1 className='text-4xl font-bold text-red-600'>404 Not Found</h1>
    </div>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/log" element={<PrivateRoute element={AdminLog} />} />
          <Route path="/settings" element={<PrivateRoute element={Setting} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
