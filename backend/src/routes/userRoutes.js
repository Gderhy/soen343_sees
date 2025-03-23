// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  fetchStakeholders,
  createEvent,
  deleteEvent,
  fetchUsersEvents,
} = require("../services/supabase/user/supabase");

// GET /api/user/stakeholders
// Fetch all stakeholders from the database
// Public -- TODO: need to move to all users
router.get("/stakeholders", async (req, res) => {
  try {
    const { data, error } = await fetchStakeholders();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Stakeholders fetched successfully: ", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/event
// Create an event
// Private for users
router.post("/event", async (req, res) => {
  try {
    // Pass the request body to the createEvent function which contains the event details
    const { eventId, error } = await createEvent(req.body);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Event created successfully: ", eventId);
    res.json(eventId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/:userId/event
// Fetch all events for a user
router.get("/:userId/events", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { data, error } = await fetchUsersEvents(userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Events fetched successfully for user: ", userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/event/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { error } = await deleteEvent(eventId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Event deleted successfully: ", req.params.eventId);
    res.json({ message: `Event: ${eventId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
