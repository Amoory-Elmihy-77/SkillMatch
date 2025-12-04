const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const opportunityRoutes = require("./routes/opportunity.routes");
const adminRoutes = require("./routes/admin.routes");
const connectionRoutes = require("./routes/connection.routes");
const notificationRoutes = require("./routes/notification.routes");
const applicationRoutes = require("./routes/application.routes");
const managerRoutes = require("./routes/manager.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { limiter } = require("./middlewares/globalLimiting.middleware");

const allowedOrigins = [process.env.FRONTEND_URL, process.env.LOCAL_URL];

const app = express();

// socket setup
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  const { userId } = socket.handshake.query;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} joined their room.`);
  }
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});
// Trust first proxy for rate limiting behind proxies (e.g., Heroku, Nginx)
app.set("trust proxy", 1);

// Middlewares
// Apply rate limiting to all requests
app.use(limiter);
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/manager", managerRoutes);

app.get("/", (req, res) => {
  res.send("SkillMatch Backend API is running!");
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = server;
