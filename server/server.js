const express = require("express");
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");
const AuthRoutes = require("./routes/api.auth");
const userRoutes = require("./routes/api.users");
const groupRoutes = require("./routes/api.groups");
const messaseRoutes = require("./routes/api.messages");

require("dotenv").config();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"]; // Replace with your allowed origin
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies for authenticated requests (if applicable)
};

const http = require("http").Server(app); // Creates an HTTP server for Express app

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    app.use(cors(corsOptions)); // Enable CORS if needed

    // Middleware to enable CORS
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    app.use(express.json()); // Parse incoming JSON data
    app.use(express.urlencoded({ extended: false })); // Parse incoming JSON data

    // Mount routes
    app.use("/api/Auth", AuthRoutes);

    app.use("/api/users", userRoutes);

    // Mount group routes
    app.use("/api/groups", groupRoutes);

    app.use("/api/messages", messaseRoutes);

    const PORT = process.env.PORT || 3000;

    const io = require("./socket.io");

    io.attach(http); // Attaches the Socket.IO server to the Express HTTP server

    http.listen(PORT, () => {
      console.log("Server listening on port 3000");
    });

    // app.listen(PORT, () => {
    //   console.log(`Server listening on port ${PORT}`);
    // });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1); // Exit process on connection error
  });
