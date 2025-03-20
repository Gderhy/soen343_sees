const express = require("express");
const pool = require("../db/database");
const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY start_time ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create an event
router.post("/", async (req, res) => {
  const { title, description, start_time, end_time, organizer_id, location } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO events (title, description, start_time, end_time, organizer_id, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, start_time, end_time, organizer_id, location]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create event" });
  }
});

module.exports = router;
