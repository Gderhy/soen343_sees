// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const { fetchStakeholders, createEvent } = require("../services/supabase/user/supabase");

router.get("/stakeholders", async (req, res) => {
  try {
    const { data, error } = await fetchStakeholders();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
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

module.exports = router;
