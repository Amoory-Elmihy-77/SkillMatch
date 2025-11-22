const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const opportunityRoutes = require("./routes/opportunity.routes");
const adminRoutes = require("./routes/admin.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { limiter } = require("./middlewares/globalLimiting.middleware");

const allowedOrigins = [process.env.FRONTEND_URL, process.env.LOCAL_URL];

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

app.get("/", (req, res) => {
  res.send("SkillMatch Backend API is running!");
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
