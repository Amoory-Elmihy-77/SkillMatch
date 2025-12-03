const express = require("express");
const {
  getAllConnections,
  sendConnectionRequest,
  getConnectionStatus,
  acceptConnection,
  getPendingConnections,
  rejectConnection,
} = require("../controllers/connection.controller.js");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware.protect, getAllConnections);
router.post("/send", authMiddleware.protect, sendConnectionRequest);
router.get("/status/:receiverId", authMiddleware.protect, getConnectionStatus);
router.post("/:connectionId/accept", authMiddleware.protect, acceptConnection);
router.get("/pending", authMiddleware.protect, getPendingConnections);
router.post("/:connectionId/reject", authMiddleware.protect, rejectConnection);

module.exports = router;
