const express = require('express');
const router = express.Router();
const { addBike } = require('../controllers/rentUserAddBikeController');

// JSON POST request; no Multer needed since frontend sends Base64
router.post('/', addBike);

module.exports = router;