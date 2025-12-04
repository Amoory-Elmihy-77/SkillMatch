const User = require("../models/User.model");
const Opportunity = require("../models/Opportunity.model");
const Application = require("../models/Application.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("+active");

    res.status(200).json({
      success: true,
      data: { users },
      results: users.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        success: false,
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
        .json({ success: false, message: "No user found with that ID." });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with that ID." });
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ active: true });
    const opportunityCount = await Opportunity.countDocuments();
    const applicationCount = await Application.countDocuments();

    // Get application breakdown by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusBreakdown = applicationsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: "Admin Dashboard data loaded.",
      data: {
        totalActiveUsers: userCount,
        totalOpportunities: opportunityCount,
        totalApplications: applicationCount,
        applicationsByStatus: statusBreakdown,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all applications (Admin only)
 * @route GET /api/admin/applications
 * @access Protected (Admin)
 */
exports.getAllApplications = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // Optional status filter
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate({
        path: "applicant",
        select: "username email skills",
      })
      .populate({
        path: "opportunity",
        select: "title company level type createdBy",
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        applications,
        total,
        page,
        results: applications.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
