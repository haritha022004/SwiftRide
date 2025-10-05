import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/Header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isRideBooking = location.pathname === "/ridebooking";
  const isSignin = location.pathname === "/signin";

  // Clear session when reaching home page
  React.useEffect(() => {
    if (isHomePage) {
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userEmail");
    }
  }, [isHomePage]);

  const getUserName = () => {
    const name = sessionStorage.getItem('userName');
    return (name && name !== "undefined" && name !== "null" && name.trim() !== "") 
      ? name 
      : null;
  };

  const userName = getUserName();

  // Handle login button click
  const handleLoginClick = () => {
    if (isRideBooking) {
      navigate("/booking-signin");
    }
  };

  // Don't show anything on home page
  if (isHomePage || isSignin) {
    return (
      <header className="header">
        <div className="logo">🚲 SwiftRide</div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="logo">🚲 SwiftRide</div>
      <div className="user-info">
        {userName ? (
          <span className="welcome-message">Welcome, {userName}</span>
        ) : (
          // Show login button when no session
          <button className="login-btn" onClick={handleLoginClick}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}