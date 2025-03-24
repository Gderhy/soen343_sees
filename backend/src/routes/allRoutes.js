const express = require("express");
const router = express.Router();

const {
  fetchAllEvents,
  fetchEvent,
  fetchEventAttendeeCount,
  fetchAllUniversities,
} = require("../services/supabase/all/supabase");

// GET /api/events
// Fetch all events
// Public
router.get("/events", async (req, res) => {
  try {
    const { data, error } = await fetchAllEvents();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("Events fetched successfully: ", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:eventId
// Fetch a single event by its ID
// Public
router.get("/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { data, error } = await fetchEvent(eventId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("Event fetched successfully: ", eventId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/events/:eventId/attendees-count", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { count, error } = await fetchEventAttendeeCount(eventId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log(`Event: ${eventId} attendance count: ${count} fetched successfully`);

    res.json(count);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/universities", async (req, res) => {
  try {
    const { data, error } = await fetchAllUniversities();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("Universities fetched successfully: ");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
