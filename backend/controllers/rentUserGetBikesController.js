const RentUser = require("../models/RentUserRegister");

exports.getBikes = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await RentUser.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ bikes: user.bikes });
  } catch (err) {
    console.error("Get Bikes Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
