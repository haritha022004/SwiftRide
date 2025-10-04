// routes/rentUserRoutes.js
const express = require("express");
const router = express.Router();
const { makeBikeAvailable } = require("../controllers/rentUserRentAvailableController");

router.post("/", makeBikeAvailable);

module.exports = router;