import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './pages/components/Header';
import './styles/components/Header.css'
import Footer from './pages/components/Footer';
import './styles/components/Footer.css'
import RideBooking from './pages/RideBooking';
import SignIn from './pages/SignIn';

function App() {
  return (
    <>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ridebooking" element={<RideBooking />} />
            <Route path="/signin" element={<SignIn />} />
        </Routes>
        <Footer/>
    </>
    );
}
export default App;