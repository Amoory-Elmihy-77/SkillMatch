const express = require("express");
const opportunityController = require("../controllers/opportunity.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/recommended",
  authMiddleware.protect,
  opportunityController.getRecommendedOpportunities
);

router.route("/").get(opportunityController.getOpportunities);

router.route("/:id").get(opportunityController.getOpportunity);

router.use(authMiddleware.protect);

router.post("/save/:id", opportunityController.saveOpportunity);
router.delete("/unsave/:id", opportunityController.unsaveOpportunity);

// Apply to opportunity (any authenticated user)
router.post("/apply/:id", opportunityController.applyToOpportunity);

// Admin and Manager only routes
router.use(authMiddleware.authorize("admin", "manager"));

router.route("/").post(opportunityController.createOpportunity);

router
  .route("/:id")
  .patch(opportunityController.updateOpportunity)
  .delete(opportunityController.deleteOpportunity);

module.exports = router;
