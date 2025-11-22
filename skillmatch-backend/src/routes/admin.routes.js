const express = require("express");
const adminController = require("../controllers/admin.controller");
const opportunityController = require("../controllers/opportunity.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.authorize("admin"));

router.get("/dashboard", adminController.getAdminDashboard);

router.route("/users").get(adminController.getAllUsers);

router
  .route("/users/:id")
  .patch(adminController.updateUser)
  .delete(adminController.deleteUser);

router
  .route("/opportunities")
  .get(opportunityController.getOpportunities)
  .post(opportunityController.createOpportunity);

router
  .route("/opportunities/:id")
  .get(opportunityController.getOpportunity)
  .patch(opportunityController.updateOpportunity)
  .delete(opportunityController.deleteOpportunity);

module.exports = router;
