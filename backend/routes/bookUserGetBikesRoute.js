const express = require("express");
const router = express.Router();
const getBikes = require("../controllers/bookUserGetBikesController");

router.get('/', getBikes);

module.exports = router;