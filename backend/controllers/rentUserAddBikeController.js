const RentUser = require("../models/RentUserRegister");

exports.addBike = async (req, res) => {
  try {
    const { email, bike } = req.body;

    if (!email || !bike) {
      return res.status(400).json({ message: "Email and bike details are required" });
    }

    const user = await RentUser.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert numeric fields
    bike.year = Number(bike.year);
    bike.mileage = Number(bike.mileage);
    bike.engineCC = Number(bike.engineCC);

    // Validate required bike fields
    if (!bike.bikeModel || !bike.bikeBrand || !bike.year || !bike.mileage || !bike.engineCC) {
      return res.status(400).json({ message: "All required bike fields must be provided" });
    }

    user.bikes.push(bike);
    await user.save();

    res.status(200).json({ message: "Bike added successfully", bike });
  } catch (err) {
    console.error("Add Bike Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};