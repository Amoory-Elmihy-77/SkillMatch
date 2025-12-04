const express = require("express");
const managerController = require("../controllers/manager.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// All routes require authentication and manager/admin role
router.use(authMiddleware.protect);
router.use(authMiddleware.authorize("manager", "admin"));

router.get("/dashboard", managerController.getManagerDashboard);
router.get("/opportunities", managerController.getManagerOpportunities);
router.get("/applications", managerController.getManagerApplications);

module.exports = router;
