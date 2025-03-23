const express = require("express");
const router = express.Router();

const { fetchAllEvents } = require("../services/supabase/all/supabase");

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

module.exports = router;