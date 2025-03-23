// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const { fetchStakeholders, createEvent, deleteEvent } = require("../services/supabase/user/supabase");

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

router.post("/event", async (req, res) => {
  try {
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

router.get("/event", async (req, res) => {
  try {
    const userId = req.query.userId;
    const { data, error } = await fetchEvents(userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("User's events fetched successfully: ", data);
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
