const mongoose = require("mongoose");

// License schema (structured like working bike example)
const licenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: String, required: true } // Base64 string
});

const BookUserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"],
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  license: {
    type: licenseSchema,
    required: [true, "License file is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better performance
BookUserSchema.index({ email: 1 });

module.exports = mongoose.model("BookUser", BookUserSchema);