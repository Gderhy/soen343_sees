require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Import Routes
const eventsRouter = require("./src/routes/events");
const usersRouter = require("./src/routes/users");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", usersRouter);
app.use("/events", eventsRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("SEES Backend is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
