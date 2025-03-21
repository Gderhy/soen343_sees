require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Import Routes
const adminRoutes = require("./src/routes/adminRoutes");
const stakeholderRoutes = require("./src/routes/stakeholderRoutes");
const userRoutes = require("./src/routes/userRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/stakeholder", stakeholderRoutes);
app.use("/api/user", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SEES Backend is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
