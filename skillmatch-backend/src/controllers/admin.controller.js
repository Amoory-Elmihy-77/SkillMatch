const User = require("../models/User.model");
const Opportunity = require("../models/Opportunity.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("+active");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Admins cannot change user passwords using this route.",
      });
    }

    const allowedFields = ["name", "email", "role", "active", "isVerified"];
    const updateBody = Object.keys(req.body).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    const user = await User.findByIdAndUpdate(req.params.id, updateBody, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "No user found with that ID." });
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "No user found with that ID." });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ active: true });
    const opportunityCount = await Opportunity.countDocuments();

    res.status(200).json({
      status: "success",
      message: "Admin Dashboard data loaded.",
      data: {
        totalActiveUsers: userCount,
        totalOpportunities: opportunityCount,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
