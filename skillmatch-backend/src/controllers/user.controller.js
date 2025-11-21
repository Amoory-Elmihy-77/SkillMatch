const User = require("../models/User.model");
const signToken = require("../utils/jwtFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// 1. Get Current User Data
exports.getMe = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

// 2. Update My Data
exports.updateMe = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message:
          "This link is not for changing your password. Use /updateMyPassword",
      });
    }

    const filteredBody = filterObj(
      req.body,
      "username",
      "email",
      "bio",
      "location",
      "skills",
      "interests"
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 3. Update My Password
exports.updateMyPassword = async (req, res) => {
  try {
    const { passwordCurrent, password, passwordConfirm } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.correctPassword(passwordCurrent, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "The current password is incorrect.",
      });
    }

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ status: "fail", message: "New passwords do not match." });
    }

    user.password = password;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      message:
        "Password updated successfully. You are now logged in with the new token.",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
