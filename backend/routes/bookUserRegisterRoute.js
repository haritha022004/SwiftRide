const express = require("express");
const router = express.Router();
const registerUser  = require("../controllers/bookUserRegisterController");

router.post("/", registerUser);

module.exports = router;
