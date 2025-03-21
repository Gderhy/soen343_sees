require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Import Routes
const adminRoutes = require("./src/routes/adminRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SEES Backend is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
