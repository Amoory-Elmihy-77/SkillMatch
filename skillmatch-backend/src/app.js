const express = require("express");
const app = express();
const cors = require("cors"); // سنثبت cors لاحقًا

// Middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("SkillMatch Backend API is running!");
});

module.exports = app;
