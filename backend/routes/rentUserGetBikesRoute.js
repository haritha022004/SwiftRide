const express = require("express");
const router = express.Router();
const { getBikes } = require("../controllers/rentUserGetBikesController");

// GET /api/rent-user/bikes/:email
router.get('/:email', getBikes);

module.exports = router;