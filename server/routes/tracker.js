const express = require("express");
const { handlePriceTracker } = require("../controllers/tracker");
const router = express.Router();

router.get("/", handlePriceTracker);

module.exports = router;