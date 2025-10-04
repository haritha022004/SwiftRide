import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/styles.css";
import "../styles/BikeDetails.css";

export default function BikeDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const bikeData = location.state?.bike;
  const ownerData = location.state?.owner;

  const [bike, setBike] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (bikeData) {
      setBike(bikeData);
    }
  }, [bikeData]);

  if (!bike)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>🚫 Bike not found</h2>
    );

  const handleBookNow = () => navigate("/login");

  return (
    <div className="bike-details-container">
      <div className="bike-details-card">
        {/* Image Gallery */}
        <div className="bike-gallery">
          <div className="main-image">
            <img
              src={bike.bikeImages?.[selectedImage]?.data || "https://via.placeholder.com/600x400"}
              alt={bike.bikeModel}
              className="main-bike-image"
            />
          </div>
          <div className="thumbnail-gallery">
            {bike.bikeImages?.map((img, index) => (
              <img
                key={index}
                src={img.data}
                alt={`${bike.bikeModel} ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Bike Info */}
        <div className="bike-info">
          <div className="bike-header">
            <h1>
              {bike.bikeBrand} {bike.bikeModel} {bike.year && `(${bike.year})`}
            </h1>
            <div className="bike-tags">
              {bike.fuelType && <span className="tag">{bike.fuelType}</span>}
              {bike.transmission && <span className="tag">{bike.transmission}</span>}
              {bike.mileage && <span className="tag">Mileage: {bike.mileage} kmpl</span>}
            </div>
          </div>

          {/* Specs */}
          <div className="specs-section section-card">
            <h3>Specifications</h3>
            <div className="specs-grid">
              {bike.engineCC && (
                <div className="spec-item">
                  <span>🏍️ Engine</span>
                  <span>{bike.engineCC} cc</span>
                </div>
              )}
              {bike.transmission && (
                <div className="spec-item">
                  <span>⚙️ Transmission</span>
                  <span>{bike.transmission}</span>
                </div>
              )}
              {bike.mileage && (
                <div className="spec-item">
                  <span>⛽ Mileage</span>
                  <span>{bike.mileage} kmpl</span>
                </div>
              )}
              {bike.fuelType && (
                <div className="spec-item">
                  <span>⛽ Fuel Type</span>
                  <span>{bike.fuelType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="features-section section-card">
            <h3>Features</h3>
            <div className="features-grid">
              {bike.features?.length > 0 ? (
                bike.features.map((f, i) => <span key={i} className="feature-item">✅ {f}</span>)
              ) : (
                <p className="no-features">No features listed</p>
              )}
            </div>
          </div>

          {/* Owner Info */}
          <div className="owner-section section-card">
            <h3>Owner Information</h3>
            <div className="owner-card">
              <div className="owner-details">
                <p>👤 <strong>Username:</strong> {ownerData?.username || "N/A"}</p>
                <p>📧 <strong>Email:</strong> {ownerData?.email || "N/A"}</p>
                <p>📞 <strong>Phone:</strong> {ownerData?.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Pricing & Booking */}
          <div className="booking-card section-card">
            <h3>Pricing & Availability</h3>
            <div className="price-item">
              <span>Daily Rent:</span>
              <span>₹{bike.price}</span>
            </div>
            <div className="availability-info">
              <span>Available:</span>
              <span className={bike.available ? "available" : "not-available"}>
                {bike.available
                  ? `✅ Yes (from ${new Date(bike.availableDate).toDateString()})`
                  : "❌ Not Available"}
              </span>
            </div>
            <button 
              className={`book-btn ${!bike.available ? 'disabled' : ''}`} 
              onClick={handleBookNow} 
              disabled={!bike.available}
            >
              📅 Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}