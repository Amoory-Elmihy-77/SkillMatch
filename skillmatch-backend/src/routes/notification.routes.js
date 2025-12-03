const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/:notificationId/read", protect, markAsRead);
router.post("/read-all", protect, markAllAsRead);

module.exports = router;
