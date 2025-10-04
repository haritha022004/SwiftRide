const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  bikeModel: { type: String, required: true },
  bikeBrand: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  engineCC: { type: Number, required: true },
  fuelType: { type: String, default: "Petrol" },
  transmission: { type: String, default: "Manual" },
  description: { type: String },
  features: { type: [String], default: [] },
  bikeImages: [
    {
      data: { type: String, required: true },   // Base64 string
      name: { type: String, required: true },
      type: { type: String, required: true }
    }
  ],
  documents: [
    {
      data: { type: String, required: true },   // Base64 string
      name: { type: String, required: true },
      type: { type: String, required: true }
    }
  ],
  available: { type: Boolean, default: false },
  availableDate: { type: Date, default: null },
  price: { type: Number, default: 0 },
  approved: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String, required: true },
  password: { type: String, required: true },
  bikes:    { type: [bikeSchema], default: [] },
  admin:    { type: Boolean, default: false },
  createdAt:{ type: Date, default: Date.now },
});

module.exports = mongoose.model("RentUser", userSchema);