import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/components/SignUp.css";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    license: null,
    aadhar: null,
    profilePic: null,
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Add useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!form.username) newErrors.username = "Username is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!form.license) newErrors.license = "License is required";
    if (!form.aadhar) newErrors.aadhar = "Aadhar card is required";
    if (!form.agree) newErrors.agree = "You must accept the terms";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log("Registering:", form);
    // TODO: Connect with backend API
    
    // Navigate to SendRequest page after successful registration
    navigate("/send-request");
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (field, file) => {
    handleInputChange(field, file);
    
    // Validate file type and size
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [field]: "File size must be less than 5MB" }));
        handleInputChange(field, null);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Join SwiftRider to start renting your bike</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`form-input ${errors.username ? 'error' : ''}`}
              required
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`form-input ${errors.password ? 'error' : ''}`}
              required
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              required
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* License Upload */}
          <div className="form-group">
            <label className="file-label">
              📄 Driving License *
            </label>
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange('license', e.target.files[0])}
                className="file-input"
                id="license"
              />
              <label htmlFor="license" className="file-input-label">
                {form.license ? form.license.name : "Choose License File"}
              </label>
            </div>
            {errors.license && <span className="error-text">{errors.license}</span>}
            <p className="file-hint">Upload your valid driving license (PDF or image)</p>
          </div>

          {/* Aadhar Card Upload */}
          <div className="form-group">
            <label className="file-label">
              🆔 Aadhar Card *
            </label>
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange('aadhar', e.target.files[0])}
                className="file-input"
                id="aadhar"
              />
              <label htmlFor="aadhar" className="file-input-label">
                {form.aadhar ? form.aadhar.name : "Choose Aadhar File"}
              </label>
            </div>
            {errors.aadhar && <span className="error-text">{errors.aadhar}</span>}
            <p className="file-hint">Upload your Aadhar card for verification</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="form-group">
            <label className="file-label">
              📸 Profile Picture
            </label>
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('profilePic', e.target.files[0])}
                className="file-input"
                id="profilePic"
              />
              <label htmlFor="profilePic" className="file-input-label">
                {form.profilePic ? form.profilePic.name : "Choose Profile Picture"}
              </label>
            </div>
            {form.profilePic && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(form.profilePic)} 
                  alt="Profile preview" 
                  className="preview-image"
                />
              </div>
            )}
            <p className="file-hint">Optional: Upload your profile picture</p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => handleInputChange('agree', e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              I accept the <a href="#terms" className="terms-link">Terms & Conditions</a> and <a href="#privacy" className="terms-link">Privacy Policy</a>
            </label>
            {errors.agree && <span className="error-text">{errors.agree}</span>}
          </div>

          <button type="submit" className="signup-button">
            🚀 Create Account & List Bike
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/signin" className="login-link-text">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}