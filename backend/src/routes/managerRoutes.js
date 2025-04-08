// src/routes/managerRoutes.js
const express = require("express");
const router = express.Router();

// Import the necessary controllers
const { getAttendanceTrendsController } = require("../controllers/managerControllers");


// POST api/manager/event/get-attendance-trends 
// pass eventId in the body
router.post("/event/get-attendance-trends", getAttendanceTrendsController);

module.exports = router;
