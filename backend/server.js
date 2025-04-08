require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");

const allowedOrigins = [
  "http://localhost:5173",
  //add other origins such as production url for cors
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Import Routes
const adminRoutes = require("./src/routes/adminRoutes");
const stakeholderRoutes = require("./src/routes/stakeholderRoutes");
const userRoutes = require("./src/routes/userRoutes");
const allRoutes = require("./src/routes/allRoutes");
const managerRoutes = require("./src/routes/managerRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/stakeholder", stakeholderRoutes);
app.use("/api/user", userRoutes);
app.use("/api", allRoutes);
app.use("/api/manager", managerRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SEES Backend is running!");
});

// Socket
io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);

  socket.on('userConn', (message) => {

    const returnMessage = {
      id: "server",
      user: "SERVER",
      message: `${message.user} has joined the live chat!`
    };

    console.log(`${message.user} has connected`);
    io.emit('receiveMessage', returnMessage);
  });

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
    console.log(`message received, ${message.user}: ${message.message}`);
  });

  socket.on('disc', (message) =>{
    const returnMessage = {
      id: "server",
      user: "SERVER",
      message: `${message.user} has disconnected`
    };
    io.emit('receiveMessage', returnMessage);
  });

  socket.on('disconnect', () => {
    console.log(`a user has disconnected`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
