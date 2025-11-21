const User = require("../models/User.model");
const sendEmail = require("../utils/email");
const signToken = require("../utils/jwtFactory");

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        interests: user.interests,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    },
  });
};

// SignUp
exports.signup = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "This email is already taken" });
    }

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ status: "fail", message: "Passwords do not match." });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      username,
      email,
      password,
      skills,
      verificationCode: verifyCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000,
    });

    const message = `Hello ${username},\n\nYour activation code for SkillMatch is:\n${verifyCode}\n\nThis code is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Account activation code - SkillMatch",
        message: message,
      });

      res.status(201).json({
        status: "success",
        message:
          "Registration successful! Please check your email for the verification code.",
      });
    } catch (err) {
      newUser.verificationCode = undefined;
      newUser.verificationCodeExpires = undefined;
      await newUser.save({ validateBeforeSave: false });

      res.status(500).json({
        status: "error",
        message:
          "User created, but failed to send verification email. Please try to resend the code.",
      });
    }
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Verify Account
exports.verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "The code is invalid or has expired.",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Resend Verification Code
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "This email address is not registered.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "fail",
        message: "This account is already active, you can log in.",
      });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = newCode;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const message = `Your new activation code is:\n${newCode}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "New activation code - SkillMatch",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "A new code has been sent to your email.",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Failed to send the new code email.",
      });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        status: "fail",
        message: "Account is not verified. Please verify your account first.",
      });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
