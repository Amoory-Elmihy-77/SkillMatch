const User = require("../models/User.model");
const sendEmail = require("../utils/email");
const signToken = require("../utils/jwtFactory");

// Forget password (send code)
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).json({
        status: "success",
        message: "If the user exists, a password recovery code has been sent.",
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.passwordResetToken = resetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const message = `\nYour password reset code for SkillMatch is: ${resetCode}\n\nThis code is valid for 10 minutes only.`;

    res.status(200).json({
      status: "success",
      message: "If the user exists, a password recovery code is being sent.",
    });

    sendEmail({
      email: user.email,
      subject: "Password recovery code - SkillMatch",
      message,
    }).catch(async (err) => {
      console.log("Password reset email failed:", err);

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Verify Reset Code
exports.verifyPassResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      passwordResetToken: code,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "The code is invalid or has expired.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Correct code, now you can update your password",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, passwordConfirm } = req.body;

    if (newPassword !== passwordConfirm) {
      return res
        .status(400)
        .json({ status: "fail", message: "New passwords do not match." });
    }

    const user = await User.findOne({
      email,
      passwordResetToken: code,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "The code is invalid or has expired.",
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      message: "Password reset successfully. You are now logged in.",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
