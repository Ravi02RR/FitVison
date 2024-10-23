import { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import ErrorBoundry from './ErrorHandler/ErrorBoundry';
const PrivateRoute = lazy(() => import('./components/Private/PrivateRoute'));
const PublicRoute = lazy(() => import('./components/Private/PublicRoute'));
const ProRoute = lazy(() => import('./components/Private/ProRoute'));

// Pages
const Home = lazy(() => import('./page/Home/Home'));
const About = lazy(() => import('./page/About/About'));
const Signin = lazy(() => import('./page/auth/Signin'));
const Signup = lazy(() => import('./page/auth/Signup'));
const Profile = lazy(() => import('./page/Profile/Profile'));
const ForgetPassword = lazy(() => import('./page/auth/ForgetPassword'));
const ResetPassword = lazy(() => import('./page/auth/ResetPassword'));
const AdminLog = lazy(() => import('./page/Admin/AdminLog'));
const Setting = lazy(() => import('./page/Settings/Setting'));
const Progress = lazy(() => import('./page/Progress/Progress'));
const Pro = lazy(() => import('./page/Plans/Pro'));
const Paymentsucess = lazy(() => import('./page/Plans/Paymentsucess'));
const PoseEstimation = lazy(() => import('./page/PoseEstimation/PoseEstimation'));
const DietPlanner = lazy(() => import('./page/exerciseanddietplanner/DietPlanner'));
const ExercisePlanner = lazy(() => import('./page/exerciseanddietplanner/ExercisePlanner'));
const ReqPerUser = lazy(() => import('./page/Admin/ReqPerUser'));
const ProgressReport = lazy(() => import('./page/Admin/ProgressReport'));
const SendMassMail = lazy(() => import('./page/Admin/SendMassMail'));
const AdminNavBar = lazy(() => import('./page/Admin/AdminNav'));
const NutritionAnalysis = lazy(() => import('./page/SuperUser/NutritionAnalysis'))

function NotFound() {
  return (
    <div className='min-h-screen bg-gray-900 flex justify-center items-center'>
      <h1 className='text-4xl font-bold text-red-600'>404 Not Found</h1>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-900 flex justify-center items-center'>
      <h2 className='text-2xl font-bold text-white'>Loading...</h2>
    </div>
  );
}

const AdminLayout = () => (
  <>
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 '>
      <AdminNavBar />
      <Outlet />
    </div>
  </>
);

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
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
          <Route
            path="/forget-password"
            element={
              <PublicRoute user={user}>
                <ForgetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute user={user}>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/pose"
            element={
              <ProRoute user={user}>
                <PoseEstimation />
              </ProRoute>
            }
          />
          <Route
            path="/foodanalysis"
            element={
              <ProRoute user={user}>
                <NutritionAnalysis />
              </ProRoute>
            }
          />
          <Route path="/settings" element={<PrivateRoute element={Setting} />} />
          <Route path="/progress" element={<PrivateRoute element={Progress} />} />
          <Route path="/dietplanner" element={<PrivateRoute element={DietPlanner} />} />
          <Route path="/paymentsuccess" element={<PrivateRoute element={Paymentsucess} />} />
          <Route path="/exerciseplanner" element={<PrivateRoute element={ExercisePlanner} />} />
          <Route path="/pro" element={<Pro />} />

          {/* Admin routes */}
          <Route path="/admin" element={<PrivateRoute element={AdminLayout} />}>
            <Route path="log" element={<ErrorBoundry><AdminLog /></ErrorBoundry>} />
            <Route path="reqperuser" element={<ReqPerUser />} />
            <Route path="progressreport" element={<ProgressReport />} />
            <Route path="massmail" element={<ErrorBoundry><SendMassMail /></ErrorBoundry>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;