import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/SignUp.css";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.username) newErrors.username = "Username is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.agree) newErrors.agree = "You must accept the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/rent-user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to register");

      const data = await res.json();
      console.log("User registered:", data);
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
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
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => handleInputChange("agree", e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              I accept the <a href="#terms" className="terms-link">Terms & Conditions</a> and <a href="#privacy" className="terms-link">Privacy Policy</a>
            </label>
            {errors.agree && <span className="error-text">{errors.agree}</span>}
          </div>

          <button type="submit" className="signup-button">
            🚀 Create Account
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/signin" className="login-link-text">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}