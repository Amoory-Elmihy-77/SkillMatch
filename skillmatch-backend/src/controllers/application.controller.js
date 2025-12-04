const Application = require("../models/Application.model");
const Opportunity = require("../models/Opportunity.model");
const Notification = require("../models/Notification.model");

exports.getApplicationStatus = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const applicantId = req.user.id;

    const application = await Application.findOne({
      applicant: applicantId,
      opportunity: opportunityId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No application found for this opportunity",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: application.status,
        appliedAt: application.appliedAt,
        reviewedAt: application.reviewedAt,
        notes: application.notes,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getMyApplications = async (req, res, next) => {
  try {
    const applicantId = req.user.id;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const total = await Application.countDocuments({ applicant: applicantId });

    const applications = await Application.find({ applicant: applicantId })
      .populate({
        path: "opportunity",
        select: "title company level type salary requiredSkills",
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
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.findById(id).populate("opportunity");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      application.opportunity.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update applications for your own opportunities",
      });
    }

    application.status = status;
    application.reviewedAt = Date.now();
    if (notes) {
      application.notes = notes;
    }

    await application.save();

    const notificationMessage =
      status === "accepted"
        ? "Your application has been accepted!"
        : status === "rejected"
        ? "Your application status has been updated"
        : "Your application has been reviewed";

    await Notification.create({
      recipient: application.applicant,
      type: "job_application",
      referenceId: application.opportunity._id,
      actor: req.user.id,
    });

    if (global.io) {
      global.io.to(application.applicant.toString()).emit("notification", {
        type: "job_application",
        message: notificationMessage,
        opportunityId: application.opportunity._id,
        status: status,
      });
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: {
        application,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
