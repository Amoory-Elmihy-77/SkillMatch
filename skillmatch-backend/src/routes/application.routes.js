const express = require("express");
const applicationController = require("../controllers/application.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware.protect);

// User routes
router.get("/my-applications", applicationController.getMyApplications);
router.get("/status/:opportunityId", applicationController.getApplicationStatus);

// Manager/Admin routes
router.patch(
  "/:id/status",
  authMiddleware.authorize("admin", "manager"),
  applicationController.updateApplicationStatus
);

module.exports = router;
