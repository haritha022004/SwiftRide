import { Link } from "react-router-dom";
import "../styles/styles.css";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🚲 Welcome to SwiftRide</h1>
        <p className="hero-subtitle">Book or Rent a Bike Easily</p>
        <p className="hero-description">
          Experience the freedom of riding with our premium bike rental service. 
          Quick, convenient, and affordable.
        </p>
        
        <div className="cta-buttons">
          <Link to="/ridebooking">
            <button className="cta-button primary">Book a Bike</button>
          </Link>
          <Link to="/signin">
            <button className="cta-button secondary">Give Rent</button>
          </Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose SwiftRider?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🚀 Fast Booking</h3>
            <p>Book your bike in just a few clicks</p>
          </div>
          <div className="feature-card">
            <h3>💰 Affordable</h3>
            <p>Competitive prices for all budgets</p>
          </div>
          <div className="feature-card">
            <h3>🔧 Quality Bikes</h3>
            <p>Well-maintained and reliable bikes</p>
          </div>
        </div>
      </div>
    </div>
  );
}