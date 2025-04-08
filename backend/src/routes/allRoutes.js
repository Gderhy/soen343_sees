const express = require("express");
const router = express.Router();
const liveChatModule = require("../local/LiveChat");

const {
  fetchAllEvents,
  fetchEvent,
  fetchEventAttendeeCount,
  fetchAllUniversities,
  fetchEventsStakeholders,
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

/* 
Chat Routes
*/
//send message
router.post("/events/:eventId/messages", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const message = req.body;

    if (!message.content || !message.userId) {
      return res.status(400).json({ error: "Content and userId are required" });
    }

    const newMessage = liveChatModule.addMessage(eventId, message);
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get messages
router.get("/events/:eventId/messages", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const messages = liveChatModule.getMessages(eventId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//add attendee
router.post("/events/:eventId/chat/attendees", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const count = liveChatModule.addAttendee(eventId, userId);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get view count
router.get("event/:eventId/message/view", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const count = liveChatModule.getViewerCount(eventId);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/event/stakeholder
// get the stakeholder list of an event
router.post("/event/stakeholders", async (req, res) => {
  try {
    const { eventId } = req.body;
    const { data, error } = await fetchEventsStakeholders(eventId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("Stakeholders fetched successfully: ", data);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
