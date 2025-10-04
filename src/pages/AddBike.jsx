import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/AddBike.css";
import url from "../config";

export default function AddBike() {
  const [form, setForm] = useState({
    bikeImages: [],
    bikeModel: "",
    bikeBrand: "",
    year: "",
    mileage: "",
    engineCC: "",
    fuelType: "Petrol",
    transmission: "Manual",
    description: "",
    features: [],
    documents: []
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const fuelTypes = ["Petrol", "Diesel", "Electric", "CNG"];
  const transmissionTypes = ["Manual", "Automatic", "Semi-Automatic"];
  const bikeFeatures = [
    "ABS", "LED Lights", "Digital Display", "GPS", "USB Charging",
    "Disc Brakes", "Alloy Wheels", "Self Start", "Kick Start", "Storage Space"
  ];

  // Convert file to Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ data: reader.result, name: file.name, type: file.type });
      reader.onerror = (error) => reject(error);
    });

  const handleFileUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    const base64Files = await Promise.all(files.map(f => fileToBase64(f)));
    setForm(prev => ({ ...prev, [field]: [...prev[field], ...base64Files] }));
  };

  const removeFile = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFeatureToggle = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    const newErrors = {};

    if (!form.bikeModel.trim()) newErrors.bikeModel = "Bike model is required";
    if (!form.bikeBrand.trim()) newErrors.bikeBrand = "Bike brand is required";
    if (!form.year) newErrors.year = "Manufacturing year is required";
    if (!form.mileage) newErrors.mileage = "Mileage is required";
    if (!form.engineCC) newErrors.engineCC = "Engine capacity is required";
    
    if (form.year && (form.year < 1900 || form.year > new Date().getFullYear() + 1)) {
      newErrors.year = "Please enter a valid year";
    }
    if (form.mileage && form.mileage < 0) newErrors.mileage = "Mileage cannot be negative";
    if (form.engineCC && form.engineCC < 0) newErrors.engineCC = "Engine capacity cannot be negative";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setUploading(false);
      return;
    }

    try {
      const email = sessionStorage.getItem("userEmail");

      const bikeData = {
        ...form,
        year: Number(form.year),
        mileage: Number(form.mileage),
        engineCC: Number(form.engineCC),
      };

      const response = await fetch(`${url}/api/rent-user/add-bike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, bike: bikeData })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Bike added successfully!");
        navigate("/rent-home");
      } else {
        alert(data.message || "Failed to add bike.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-bike-container">
      <div className="add-bike-card">
        <div className="add-bike-header">
          <div className="header-icon">🚲</div>
          <h1>Add Your Bike</h1>
          <p>Fill in your bike's details to start renting</p>
        </div>

        <form onSubmit={handleSubmit} className="add-bike-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Bike Model *</label>
                <input 
                  type="text" 
                  className={`form-input ${errors.bikeModel ? 'error' : ''}`}
                  value={form.bikeModel} 
                  onChange={e => handleInputChange('bikeModel', e.target.value)} 
                  placeholder="e.g., Classic 350, Pulsar 150"
                />
                {errors.bikeModel && <span className="error-text">{errors.bikeModel}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Brand *</label>
                <input 
                  type="text" 
                  className={`form-input ${errors.bikeBrand ? 'error' : ''}`}
                  value={form.bikeBrand} 
                  onChange={e => handleInputChange('bikeBrand', e.target.value)} 
                  placeholder="e.g., Royal Enfield, Bajaj"
                />
                {errors.bikeBrand && <span className="error-text">{errors.bikeBrand}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Manufacturing Year *</label>
                <input 
                  type="number" 
                  className={`form-input ${errors.year ? 'error' : ''}`}
                  value={form.year} 
                  onChange={e => handleInputChange('year', e.target.value)} 
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="e.g., 2023"
                />
                {errors.year && <span className="error-text">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Mileage (km/l) *</label>
                <input 
                  type="number" 
                  step="0.1"
                  className={`form-input ${errors.mileage ? 'error' : ''}`}
                  value={form.mileage} 
                  onChange={e => handleInputChange('mileage', e.target.value)} 
                  placeholder="e.g., 35.5"
                />
                {errors.mileage && <span className="error-text">{errors.mileage}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Engine Capacity (cc) *</label>
                <input 
                  type="number" 
                  className={`form-input ${errors.engineCC ? 'error' : ''}`}
                  value={form.engineCC} 
                  onChange={e => handleInputChange('engineCC', e.target.value)} 
                  placeholder="e.g., 350"
                />
                {errors.engineCC && <span className="error-text">{errors.engineCC}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Fuel Type</label>
                <select 
                  className="form-input"
                  value={form.fuelType} 
                  onChange={e => handleInputChange('fuelType', e.target.value)}
                >
                  {fuelTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transmission</label>
                <select 
                  className="form-input"
                  value={form.transmission} 
                  onChange={e => handleInputChange('transmission', e.target.value)}
                >
                  {transmissionTypes.map(tt => <option key={tt} value={tt}>{tt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="form-section">
            <h3 className="section-title">Features & Amenities</h3>
            <p className="section-subtitle">Select all features that apply to your bike</p>
            <div className="features-grid">
              {bikeFeatures.map(feature => (
                <label key={feature} className="feature-checkbox">
                  <input 
                    type="checkbox" 
                    checked={form.features.includes(feature)} 
                    onChange={() => handleFeatureToggle(feature)} 
                  />
                  <span className="checkmark"></span>
                  <span className="feature-label">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h3 className="section-title">Description</h3>
            <div className="form-group">
              <label className="form-label">Tell us about your bike</label>
              <textarea 
                className="form-textarea"
                value={form.description} 
                onChange={e => handleInputChange('description', e.target.value)} 
                rows="4"
                placeholder="Describe your bike's condition, any modifications, special features, etc."
              />
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3 className="section-title">Bike Images</h3>
            <p className="section-subtitle">Upload clear photos of your bike from different angles</p>
            
            <div className="image-upload-container">
              <input 
                type="file" 
                id="bike-images"
                multiple 
                accept="image/*" 
                onChange={e => handleFileUpload(e, 'bikeImages')} 
                className="image-input"
              />
              <label htmlFor="bike-images" className="image-upload-label">
                <span className="upload-icon">📸</span>
                Click to Upload Images
                <span className="upload-hint">(Max 10 images, supported formats: JPG, PNG, WebP)</span>
              </label>
              
              {form.bikeImages.length > 0 && (
                <div className="image-previews">
                  {form.bikeImages.map((img, i) => (
                    <div key={i} className="image-preview-item">
                      <img src={img.data} alt={`Preview ${i + 1}`} />
                      <button 
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeFile('bikeImages', i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="form-section">
            <h3 className="section-title">Documents</h3>
            <p className="section-subtitle">Upload relevant documents (RC, Insurance, etc.)</p>
            
            <div className="image-upload-container">
              <input 
                type="file" 
                id="documents"
                multiple 
                onChange={e => handleFileUpload(e, 'documents')} 
                className="image-input"
              />
              <label htmlFor="documents" className="image-upload-label">
                <span className="upload-icon">📄</span>
                Click to Upload Documents
                <span className="upload-hint">(Supported formats: PDF, DOC, Images)</span>
              </label>
              
              {form.documents.length > 0 && (
                <div className="documents-list">
                  {form.documents.map((doc, i) => (
                    <div key={i} className="document-item">
                      <span className="doc-name">{doc.name}</span>
                      <button 
                        type="button"
                        className="remove-doc-btn"
                        onClick={() => removeFile('documents', i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-bike-btn"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Adding Bike...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Save Bike Details
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate("/rent-home")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}