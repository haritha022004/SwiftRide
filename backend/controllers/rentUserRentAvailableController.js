// controllers/rentUserController.js
const User = require("../models/RentUserRegister"); // adjust path

const makeBikeAvailable = async (req, res) => {
  const { email, bikeId, date, price } = req.body;

  if (!email || !bikeId || !date || !price) {
    return res.status(400).json({ message: "Email, bikeId, date and price are required" });
  }

  try {
    // Find user and bike
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const bike = user.bikes.id(bikeId);
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    // Update bike availability
    bike.available = true;
    bike.availableDate = new Date(date);
    bike.price = price;

    await user.save();

    return res.status(200).json({ message: "Bike is now available for rent!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { makeBikeAvailable };