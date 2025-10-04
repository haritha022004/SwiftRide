import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import "../styles/RideBooking.css";
import url from "../config";

export default function RideBooking() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${url}/api/book-user/get-bikes`)
      .then((res) => res.json())
      .then((data) => {
        // Filter bikes directly from bike object (not from documents array)
        const allBikes = data.bikes || [];
        const filteredBikes = allBikes.filter(bike => 
          bike.approved === true && bike.available === true
        );

        setBikes(filteredBikes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bikes:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="ride-booking-container">
        <p>Loading bikes...</p>
      </div>
    );

  return (
    <div className="ride-booking-container">
      <div className="booking-header">
        <h1>Available Bikes</h1>
        <p>Choose your perfect ride for the journey</p>
      </div>

      <div className="bikes-grid">
        {bikes.length > 0 ? (
          bikes.map((bike) => {
            const image = bike.bikeImages?.[0]?.data || "https://tse1.mm.bing.net/th/id/OIP.vbN9YIRbZJsQCpOXXEadOgHaFj";

            return (
              <div key={bike._id} className="bike-card">
                <div className="bike-image">
                  <img src={image} alt={bike.bikeModel} />
                  <div className="status-badges">
                    {bike.approved && <span className="approved-badge">✅ Approved</span>}
                    {bike.available && <span className="available-badge">🟢 Available</span>}
                  </div>
                </div>

                <span className="bike-type">{bike.bikeBrand}</span>
                <div className="bike-rating">⭐ {bike.rating || 4.5}</div>

                <div className="bike-info">
                  <h3>
                    {bike.bikeBrand} {bike.bikeModel} 
                    {bike.year && ` (${bike.year})`}
                  </h3>
                  <p className="bike-specs">
                    {bike.engineCC && <span>🏍️ {bike.engineCC}cc</span>}
                    {bike.mileage && <span>⛽ {bike.mileage} kmpl</span>}
                    {bike.transmission && <span>⚙️ {bike.transmission}</span>}
                  </p>

                  <div className="price-section">
                    <p className="bike-price">₹{bike.price} / day</p>
                    {bike.availableDate && (
                      <p className="security-deposit">
                        Available on: {new Date(bike.availableDate).toDateString()}
                      </p>
                    )}
                  </div>

                  {bike.features?.length > 0 && (
                    <div className="bike-features">
                      {bike.features.map((f, i) => (
                        <span key={i}>✨ {f}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <Link
                    to={`/bike-details/${bike._id}`}
                    state={{ 
                      bike, 
                      owner: {
                        username: bike.ownerName,
                        email: bike.ownerEmail,
                        phone: bike.ownerPhone
                      }
                    }}
                    className="view-button"
                  >
                    👀 View Details
                  </Link>
                  <Link to="/login" className="book-button">
                    📅 Book Now
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-bikes-message">
            <h3>No bikes available at the moment</h3>
            <p>All approved bikes are currently booked or unavailable. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}