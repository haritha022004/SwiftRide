const express = require("express");
const { rentUserSignin } = require("../controllers/rentUserSigninController");

const router = express.Router();

// POST /api/rent-user/signin
router.post("/", rentUserSignin);

module.exports = router;