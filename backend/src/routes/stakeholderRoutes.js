// src/routes/stakeholderRoutes.js
const express = require("express");
const router = express.Router();
const { fetchStakeholdersPendingEvents, updateStakeholderEventStatus } = require("../services/supabase/stakeholder/supabase");

// Endpoint to fetch all pending events
router.get("/:stakeholderId/events/pending", async (req, res) => {
  try {
    const stakeholderId = req.params.stakeholderId;
    const { data, error } = await fetchStakeholdersPendingEvents(stakeholderId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update a stakeholder event status
router.put("/:stakeholderId/events/:id/status", async (req, res) => {
  const stakeholderId = req.params.stakeholderId;
  const eventId = req.params.id;
  const { status } = req.body; // new status should be one of your EventStatusType values
  try {
    // Optionally, check the calling user's system role here using a middleware
    // For now, we use the updateEventStatus function which internally checks for stakeholder role
    const { data, error } = await updateStakeholderEventStatus(stakeholderId, eventId, status);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
