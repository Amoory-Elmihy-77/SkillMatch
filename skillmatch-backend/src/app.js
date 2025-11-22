const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const opportunityRoutes = require("./routes/opportunity.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const allowedOrigins = [process.env.FRONTEND_URL, process.env.LOCAL_URL];

// Middlewares
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);

app.get("/", (req, res) => {
  res.send("SkillMatch Backend API is running!");
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
