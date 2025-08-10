// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import BookBike from './pages/BookBike';
import RentBike from './pages/RentBike';
import Profile from './pages/Profile';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-y-auto pt-[80px] pl-[4rem] sm:pl-[16rem] px-6"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookBike />} />
          <Route path="/rent" element={<RentBike />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === 'b') {
        setSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <AnimatedRoutes />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;



