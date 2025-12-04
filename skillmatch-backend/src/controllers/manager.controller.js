const Opportunity = require("../models/Opportunity.model");
const Application = require("../models/Application.model");


exports.getManagerOpportunities = async (req, res) => {
  try {
    const managerId = req.user.id;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const total = await Opportunity.countDocuments({ createdBy: managerId });

    const opportunities = await Opportunity.find({ createdBy: managerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        opportunities,
        total,
        page,
        results: opportunities.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getManagerApplications = async (req, res) => {
  try {
    const managerId = req.user.id;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // Find all opportunities created by this manager
    const managerOpportunities = await Opportunity.find({
      createdBy: managerId,
    }).select("_id");

    const opportunityIds = managerOpportunities.map((opp) => opp._id);

    // Build filter for applications
    const filter = { opportunity: { $in: opportunityIds } };

    // Optional status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate({
        path: "applicant",
        select: "username email skills photo",
      })
      .populate({
        path: "opportunity",
        select: "title company level type requiredSkills",
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

exports.getManagerDashboard = async (req, res) => {
  try {
    const managerId = req.user.id;

    // Count manager's opportunities
    const opportunityCount = await Opportunity.countDocuments({
      createdBy: managerId,
    });

    // Find all opportunities created by this manager
    const managerOpportunities = await Opportunity.find({
      createdBy: managerId,
    }).select("_id");

    const opportunityIds = managerOpportunities.map((opp) => opp._id);

    // Count applications to manager's opportunities
    const applicationCount = await Application.countDocuments({
      opportunity: { $in: opportunityIds },
    });

    // Get application breakdown by status
    const applicationsByStatus = await Application.aggregate([
      {
        $match: {
          opportunity: { $in: opportunityIds },
        },
      },
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

    // Get recent applications (last 5)
    const recentApplications = await Application.find({
      opportunity: { $in: opportunityIds },
    })
      .populate({
        path: "applicant",
        select: "username email photo",
      })
      .populate({
        path: "opportunity",
        select: "title company",
      })
      .sort({ appliedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: "Manager Dashboard data loaded.",
      data: {
        totalOpportunities: opportunityCount,
        totalApplications: applicationCount,
        applicationsByStatus: statusBreakdown,
        recentApplications,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
