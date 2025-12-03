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

// 4. Get Saved Opportunities
exports.getSavedOpportunities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedOpportunities",
      select: "title company requiredSkills tags salary level type", // تحديد الحقول المطلوبة
    });

    res.status(200).json({
      status: "success",
      results: user.savedOpportunities.length,
      data: {
        savedOpportunities: user.savedOpportunities,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 5. Update Skills and Interests
exports.updateSkillsAndInterests = async (req, res) => {
  try {
    const { skills, interests, bio } = req.body;

    const updateObject = {};
    if (skills) updateObject.skills = skills;
    if (interests) updateObject.interests = interests;
    if (bio) updateObject.bio = bio;

    if (Object.keys(updateObject).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide skills, interests, or bio to update.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateObject,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Profile details updated successfully.",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 6. Deactivate My Account
exports.deactivateMe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// 7. Update Profile Photo
exports.updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "No photo uploaded." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { photo: req.file.filename },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Profile photo updated successfully.",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 8. Get Suggested Users to Connect With
exports.getSuggestedUsers = async (req, res, next) => {
  const currentUserId = req.user.id;

  try {
    const users = await User.find({
      _id: { $ne: currentUserId },
    })
      .select("email username title photo")
      .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// 9. Get Any User Profile By ID
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -__v -passwordChangedAt -passwordResetExpires -passwordResetCode"
    );

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
};
