const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/rentUserRegisterController");

router.post("/", registerUser);

module.exports = router;
