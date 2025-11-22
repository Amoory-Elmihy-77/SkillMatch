const express = require("express");
const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/password.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// 1. Authentication
router.post("/signup", authController.signup);
router.post("/verify", authController.verifyAccount);
router.post("/resendCode", authController.resendVerificationCode);
router.post("/login", authController.login);

// 2. Reset Password
router.post("/forgotPassword", passwordController.forgotPassword);
router.post("/verifyResetCode", passwordController.verifyPassResetCode);
router.patch("/resetPassword", passwordController.resetPassword);

// --- 3. Protected Routes ---
router.use(authMiddleware.protect);

// User Profile Routes
router.get("/me", userController.getMe);
router.patch("/updateMe", userController.updateMe);
router.patch("/updateMyPassword", userController.updateMyPassword);

// Saved Opportunities
router.get("/me/saved", userController.getSavedOpportunities);

// Update Skills and Interests
router.patch(
  "/updateSkillsAndInterests",
  userController.updateSkillsAndInterests
);

// Deactivate Account
router.delete("/deleteMe", userController.deactivateMe);

router.get(
  "/admin-dashboard",
  authMiddleware.authorize("admin"),
  (req, res) => {
    res
      .status(200)
      .json({ status: "success", message: "Welcome to the Admin Dashboard!" });
  }
);

module.exports = router;
