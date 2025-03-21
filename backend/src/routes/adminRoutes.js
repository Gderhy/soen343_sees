// src/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const {
  fetchUsers,
  updateUserMetaData,
  deleteUser,
  createUserAsAdmin,
} = require("../services/supabase/admin/supabase");

// GET /api/users - Fetch all users (Admins only)
router.get("/users", async (req, res) => {
  try {
    const { data, error } = await fetchUsers();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id - Update user metadata (Admins only)
router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const user_metadata = req.body.user_metadata; // expects JSON with updated metadata

  try {
    const { data, error } = await updateUserMetaData(userId, user_metadata);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id - Delete user (Admins only)
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const { success, error } = await deleteUser(userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
