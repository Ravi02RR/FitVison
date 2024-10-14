
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
//============================Components==============================
import Navbar from './components/NavBar/Navbar'
import Footer from './components/Footer/Footer'



//==========================elements==========================
import Home from './page/Home/Home'
import About from './page/About/About'
import Signin from './page/auth/Signin'
import Signup from './page/auth/Signup'
import Profile from './page/Profile/Profile'




function NotFound() {
  return (<>
    <div className='min-h-screen  bg-gray-900 flex justify-center items-center'>
      <h1 className='text-4xl font-bold text-red-600'>404 Not Found</h1>
    </div>
  </>
  )
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
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
