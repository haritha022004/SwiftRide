// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaBicycle, FaUser, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Sidebar({ isOpen, setIsOpen }) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [sort, setSort] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('location');
    const savedDate = localStorage.getItem('date');
    const savedSort = localStorage.getItem('sort');
    if (savedLocation) setLocation(savedLocation);
    if (savedDate) setDate(savedDate);
    if (savedSort) setSort(savedSort);
  }, []);

  useEffect(() => {
    localStorage.setItem('location', location);
    localStorage.setItem('date', date);
    localStorage.setItem('sort', sort);
  }, [location, date, sort]);

  const handleBookClick = () => {
    const query = new URLSearchParams();
    if (location) query.set('location', location);
    if (date) query.set('date', date);
    if (sort) query.set('sort', sort);
    navigate(`/book?${query.toString()}`);
  };

  const clearFilters = () => {
    setLocation('');
    setDate('');
    setSort('');
  };

  const sidebarVariants = {
    open: { width: '16rem', opacity: 1 },
    closed: { width: '4rem', opacity: 1 },
  };

  const Tooltip = ({ text }) => (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -5 }}
      className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded shadow-lg z-50 whitespace-nowrap"
    >
      {text}
    </motion.div>
  );

  return (
    <motion.aside
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-screen z-40 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md p-4 shadow-lg overflow-hidden"
    >
      <AnimatePresence>
        {isOpen && (
          <>
            <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300 flex items-center gap-2">
              <FaSearch /> Explore
            </h2>

            <input
              type="text"
              placeholder="Search location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Sort</option>
              <option value="price">Sort by Price</option>
              <option value="model">Sort by Model</option>
            </select>

            <button
              onClick={clearFilters}
              className="mb-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Clear Filters
            </button>
          </>
        )}
      </AnimatePresence>

      <nav className="flex flex-col gap-4 relative">
        <div className="relative group">
          <button
            onClick={handleBookClick}
            className={`flex items-center gap-2 text-left ${
              location || date || sort ? 'text-blue-700 font-semibold' : 'text-blue-500'
            } hover:underline`}
          >
            <FaBicycle /> {isOpen && 'Book a Bike'}
          </button>
          {!isOpen && <Tooltip text="Book a Bike" />}
        </div>

        <div className="relative group">
          <NavLink
            to="/rent"
            className={({ isActive }) =>
              `flex items-center gap-2 text-left hover:underline ${
                isActive ? 'text-blue-700 font-semibold' : 'text-blue-500'
              }`
            }
          >
            <FaBicycle /> {isOpen && 'Rent Your Bike'}
          </NavLink>
          {!isOpen && <Tooltip text="Rent Your Bike" />}
        </div>

        <div className="relative group">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 text-left hover:underline ${
                isActive ? 'text-blue-700 font-semibold' : 'text-blue-500'
              }`
            }
          >
            <FaUser /> {isOpen && 'Profile'}
          </NavLink>
          {!isOpen && <Tooltip text="Profile" />}
        </div>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;