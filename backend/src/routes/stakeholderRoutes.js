// src/routes/stakeholderRoutes.js
const express = require("express");
const router = express.Router();
const { fetchStakeholdersPendingEvents, updateStakeholderEventStatus, fetchStakeholdersEvent } = require("../services/supabase/stakeholder/supabase");

// Endpoint to fetch all pending events
router.get("/:stakeholderId/events/pending", async (req, res) => {
  try {
    const stakeholderId = req.params.stakeholderId;
    const { data, error } = await fetchStakeholdersPendingEvents(stakeholderId);
    if (error) {
      console.log("Error fetching stakeholder's pending events: ", error);
      return res.status(500).json({ error: error.message });
    }
    // console.log("Stakeholder's pending events fetched successfully: ", data);
    console.log("Stakeholder's pending events fetched successfully: ");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update a stakeholder event status
router.put("/:stakeholderId/events/:eventId/status", async (req, res) => {  
  try {
  const stakeholderId = req.params.stakeholderId;
  const eventId = req.params.eventId;
  const { status } = req.body; // new status should be one of your EventStatusType values
    // Optionally, check the calling user's system role here using a middleware
    // For now, we use the updateEventStatus function which internally checks for stakeholder role
    const {data, error } = await updateStakeholderEventStatus(stakeholderId, eventId, status);
    if (error !== null) {
      console.log(`Error updating event: ${eventId} status: `, error);
      return res.status(500).json({ error: error.message });
    }
    console.log(`Event: ${eventId} status updated successfully`);
    res.json({ message: `Event: ${eventId} status updated successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:stakeholderId/events", async (req, res) => {
  try {
    const stakeholderId = req.params.stakeholderId;
    const { data, error } = await fetchStakeholdersEvent(stakeholderId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log("Stakeholder's events fetched successfully: ", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

module.exports = router;
