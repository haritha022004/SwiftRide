import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/BookingSignUp.css";
import url from "../config";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
    licenseFile: null,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Convert file to Base64 (same as working AddBike component)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          name: file.name,
          type: file.type,
          data: reader.result,
        });
      reader.onerror = (error) => reject(error);
    });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB like in working example)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, licenseFile: "File size must be less than 5MB" }));
      return;
    }
    
    try {
      const base64File = await fileToBase64(file);
      setForm((prev) => ({ ...prev, licenseFile: base64File }));
      if (errors.licenseFile) setErrors(prev => ({ ...prev, licenseFile: "" }));
    } catch (error) {
      setErrors(prev => ({ ...prev, licenseFile: "Failed to process file" }));
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.agree) newErrors.agree = "You must accept the terms";
    if (!form.licenseFile) newErrors.licenseFile = "License upload is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setUploading(true);
      
      // 🔹 STRUCTURED DATA LIKE WORKING ADD_BIKE COMPONENT
      const userData = {
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        licenseFile: form.licenseFile
      };

      console.log("Sending registration data:", {
        username: userData.username,
        email: userData.email,
        licenseFile: userData.licenseFile ? `${userData.licenseFile.data.substring(0, 50)}...` : 'none'
      });

      const res = await fetch(`${url}/api/book-user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("✅ Registration successful!");
      navigate("/booking-signin");
    } catch (err) {
      console.error("Registration Error:", err);
      alert("Network error - please try again");
    } finally {
      setUploading(false);
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
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`form-input ${errors.username ? "error" : ""}`}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`form-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`form-input ${errors.phone ? "error" : ""}`}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`form-input ${errors.password ? "error" : ""}`}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* 🔹 License Upload */}
          <div className="form-group">
            <label className="file-label">
              Upload Driver's License:
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="file-input"
              />
            </label>
            {form.licenseFile && (
              <p className="upload-success">✅ {form.licenseFile.name} selected</p>
            )}
            {errors.licenseFile && <span className="error-text">{errors.licenseFile}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => handleInputChange("agree", e.target.checked)}
                className="checkbox-input"
              />
              I accept the{" "}
              <a href="#terms" className="terms-link">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#privacy" className="terms-link">
                Privacy Policy
              </a>
            </label>
            {errors.agree && <span className="error-text">{errors.agree}</span>}
          </div>

          <button type="submit" className="signup-button" disabled={uploading}>
            {uploading ? "Creating Account..." : "🚀 Create Account"}
          </button>
        </form>

        <div className="login-link">
          Already have an account?{" "}
          <Link to="/booking-signin" className="login-link-text">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}