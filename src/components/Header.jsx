// src/components/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';

function Header({ toggleSidebar }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // You can route or filter based on searchQuery
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-blue-600 shadow' : 'bg-transparent'
      } text-white`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="text-xl sm:text-2xl text-white hover:text-gray-200 transition"
          aria-label="Toggle Sidebar"
        >
          <FaChevronRight />
        </button>

        {/* Logo */}
        <h1 className="text-2xl font-bold">🏍️ Bike Rentals</h1>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-white rounded px-3 py-1 text-blue-600">
          <FaSearch />
          <input
            type="text"
            placeholder="Search bikes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-transparent outline-none w-40"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="text-xl hover:text-gray-200 transition" aria-label="Notifications">
            <FaBell />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl hover:text-gray-200 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="text-xl hover:text-gray-200 transition"
              aria-label="User Menu"
            >
              <FaUserCircle />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-blue-600 rounded shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2"
                  onClick={() => {
                    setDropdownOpen(false);
                    console.log('Logout clicked');
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`${
          menuOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-[-20px] opacity-0 sm:opacity-100 sm:translate-y-0'
        } sm:hidden flex flex-col gap-4 text-lg items-start px-6 py-4 bg-blue-600 transition-all duration-300`}
      >
        <Link to="/" className="hover:underline hover:text-gray-200 transition">Home</Link>
        <Link to="/book" className="hover:underline hover:text-gray-200 transition">Book</Link>
        <Link to="/rent" className="hover:underline hover:text-gray-200 transition">Rent Out</Link>
        <Link to="/profile" className="hover:underline hover:text-gray-200 transition">Profile</Link>
      </nav>
    </header>
  );
}

export default Header;