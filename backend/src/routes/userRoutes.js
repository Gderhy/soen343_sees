// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  fetchStakeholders,
  createEvent,
  deleteEvent,
  fetchUsersEvents,
  updateEvent,
  rsvpToEvent,
  deleteRsvp,
  checkRsvp,
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

// PUT /api/user/:userId/event
// Update an event
// Private for users
router.put("/:userId/event/", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { error } = await updateEvent(userId, req.body);

    if (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Event updated successfully:", req.body.event.id);
    res.json({ message: `Event ${req.body.event.id} updated successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/rsvp
// Allow for users to rsvp to events
// Private for users
router.post("/rsvp", async (req, res) => {
  try {
    const { data, error } = await rsvpToEvent(req.body);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("RSVP successful for user: ", req.body.userId);
    res.json({ message: "RSVP successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE /api/user/rsvp
// Allow for users to delete their RSVP to events
// Private for users
router.delete("/rsvp", async (req, res) => {
  try {
    const { error } = await deleteRsvp(req.body);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("RSVP deleted successfully for user: ", req.body.userId);
    res.json({ message: "RSVP deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/check-rsvp
// Check if a user has RSVP'd to an event
router.post("/check-rsvp", async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await checkRsvp(userId, eventId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "User has not RSVP'd to this event" });
    }

    console.log(`User: ${userId} has RSVP'd to this event: ${eventId}`);
    res.json({ message: "User has RSVP'd to this event" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
