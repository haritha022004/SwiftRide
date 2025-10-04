import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './pages/Header';
import './styles/Header.css'
import Footer from './pages/Footer';
import './styles/Footer.css'
import RideBooking from './pages/RideBooking';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddBike from './pages/AddBike';
import RentHome from './pages/RentHome';
import BikeDetails from './pages/BikeDetails';

function App() {
  return (
    <>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ridebooking" element={<RideBooking />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/rent-home" element={<RentHome />} />
            <Route path='/add-bike' element={<AddBike />} />
            <Route path="/bike-details/:id" element={<BikeDetails />} />
        </Routes>
        <Footer/>
    </>
    );
}
export default App;