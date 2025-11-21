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
router.use(authMiddleware.authorize("admin"));

router.route("/").post(opportunityController.createOpportunity);

router
  .route("/:id")
  .patch(opportunityController.updateOpportunity)
  .delete(opportunityController.deleteOpportunity);

module.exports = router;
