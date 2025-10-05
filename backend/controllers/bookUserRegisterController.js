const RentUser = require("../models/BookUserRegister");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    console.log("Received registration request body:", {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      licenseFile: req.body.licenseFile ? `File: ${req.body.licenseFile.name}, Type: ${req.body.licenseFile.type}` : 'none'
    });

    const { username, email, phone, password, licenseFile } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Validation (improved like working example)
    if (!username || !email || !phone || !password || !licenseFile) {
      console.log("Missing fields:", { username, email, phone, password: !!password, licenseFile: !!licenseFile });
      return res.status(400).json({ 
        message: "All fields including license are required" 
      });
    }

    // Check if user already exists
    const existingUser = await RentUser.findOne({ email });
    if (existingUser) {
      console.log("Email already exists:", email);
      return res.status(409).json({ 
        message: "Email already registered. Please sign in instead." 
      });
    }

    // Create new user with structured data (like working bike example)
    const newUser = new RentUser({
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      license: {
        name: licenseFile.name,
        type: licenseFile.type,
        data: licenseFile.data, // Base64 string
      },
    });

    // Save user to database
    await newUser.save();
    console.log("User registered successfully:", newUser.email);

    res.status(201).json({
      message: "User registered successfully",
      user: { 
        username: newUser.username, 
        email: newUser.email, 
        phone: newUser.phone 
      },
    });

  } catch (err) {
    console.error("Register Error Details:", err);
    
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: "Email already registered" 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Invalid input data",
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = registerUser;