const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

// Middlewares
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SkillMatch Backend API is running!");
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
