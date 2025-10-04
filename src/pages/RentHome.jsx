import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/RentHome.css";
import url from "../config"; 

export default function RentHome() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddBike = () => {
    navigate("/add-bike"); 
  };

const handleMakeAvailable = async (bikeId) => {
  const date = prompt("Enter the available date (YYYY-MM-DD):");
  const price = prompt("Enter the price for the day:");

  if (!date || !price) {
    alert("Both date and price are required!");
    return;
  }

  const email = sessionStorage.getItem("userEmail"); // must include email

  try {
    const res = await fetch(`${url}/api/rent-user/rent-available`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        bikeId,
        date,
        price: Number(price)
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);

      // Refresh bikes
      const refreshRes = await fetch(`${url}/api/rent-user/get-bikes/${encodeURIComponent(email)}`);
      const refreshData = await refreshRes.json();
      if (refreshRes.ok) setBikes(refreshData.bikes);
    } else {
      alert(data.message || "Failed to make bike available.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};

  useEffect(() => {
    const fetchBikes = async () => {
      const email = sessionStorage.getItem("userEmail");
      if (!email) return;

      try {
        const res = await fetch(`${url}/api/rent-user/get-bikes/${encodeURIComponent(email)}`);
        const data = await res.json();
        if (res.ok) {
          setBikes(data.bikes);
        } else {
          alert(data.message || "Failed to fetch bikes.");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  if (loading) return (
    <div className="rent-home-loading">
      <div className="loading-spinner"></div>
      <p>Loading your bikes...</p>
    </div>
  );

  return (
    <div className="rent-home-container">
      <div className="rent-home-card">
        <div className="rent-home-header">
          <div className="header-icon">🏍️</div>
          <h1>Your Bike Collection</h1>
          <p>Manage and monitor all your listed bikes</p>
        </div>

        <div className="action-section">
          <button className="add-bike-btn" onClick={handleAddBike}>
            <span className="btn-icon">➕</span>
            Add New Bike
          </button>
        </div>

        <div className="bikes-section">
          {bikes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚲</div>
              <h3>No bikes added yet</h3>
              <p>Start by adding your first bike to rent</p>
              <button className="empty-state-btn" onClick={handleAddBike}>
                Add Your First Bike
              </button>
            </div>
          ) : (
            <div className="bikes-grid">
              {bikes.map((bike, index) => (
                <div key={index} className="bike-card">
                  <div className="bike-card-header">
                    <h3 className="bike-title">
                      {bike.bikeBrand} {bike.bikeModel}
                    </h3>
                    <span className="bike-year">({bike.year})</span>
                  </div>
                  
                  <div className="bike-specs">
                    <div className="spec-item">
                      <span className="spec-label">Mileage:</span>
                      <span className="spec-value">{bike.mileage} km/l</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Engine:</span>
                      <span className="spec-value">{bike.engineCC} cc</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Fuel:</span>
                      <span className="spec-value">{bike.fuelType}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Transmission:</span>
                      <span className="spec-value">{bike.transmission}</span>
                    </div>
                  </div>

                  {bike.description && (
                    <div className="bike-description">
                      <p>{bike.description}</p>
                    </div>
                  )}

                  {bike.bikeImages.length > 0 && (
                    <div className="bike-images">
                      <h4>Images</h4>
                      <div className="images-grid">
                        {bike.bikeImages.map((img, i) => (
                          <div key={i} className="image-item">
                            <img
                              src={img.data}
                              alt={img.name}
                              className="bike-image"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {bike.documents.length > 0 && (
                    <div className="bike-documents">
                      <h4>Documents</h4>
                      <div className="documents-list">
                        {bike.documents.map((doc, i) => (
                          <a
                            key={i}
                            href={doc.data}
                            download={doc.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="document-link"
                          >
                            <span className="doc-icon">📄</span>
                            {doc.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bike-actions">
                    {bike.available ? (
                      <div className="bike-availability-info">
                        <span>✅ Available on: {new Date(bike.availableDate).toLocaleDateString()}</span><br/>
                        <span>Price: ₹{bike.price}</span><br/>
                        <span>Approved: {bike.approved?"yes":"no"}</span>
                      </div>
                    ) : (
                      <button
                        className="make-available-btn"
                        onClick={() => handleMakeAvailable(bike._id || index)}
                      >
                        <span className="btn-icon">✅</span>
                        Make Available for Rent
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}