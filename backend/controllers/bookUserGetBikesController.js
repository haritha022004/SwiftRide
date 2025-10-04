const RentUser = require("../models/RentUserRegister");

const getAvailableBikes = async (req, res) => {
  try {
    const users = await RentUser.find({ "bikes.available": true });
    let bikes = [];

    users.forEach(user => {
      user.bikes.forEach(bike => {
        if (bike.approved && bike.available) {
          bikes.push({
            ...bike.toObject(),
            ownerEmail: user.email,
            ownerName: user.username,
            ownerPhone: user.phone  // Added phone number
          });
        }
      });
    });

    res.json({ bikes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bikes", error: err.message });
  }
};

module.exports = getAvailableBikes;