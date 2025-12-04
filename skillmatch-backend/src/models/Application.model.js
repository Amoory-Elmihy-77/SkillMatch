const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Application must have an applicant"],
    },
    opportunity: {
      type: mongoose.Schema.ObjectId,
      ref: "Opportunity",
      required: [true, "Application must be linked to an opportunity"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ applicant: 1, opportunity: 1 }, { unique: true });

ApplicationSchema.index({ opportunity: 1 });

ApplicationSchema.index({ applicant: 1 });

module.exports = mongoose.model("Application", ApplicationSchema);
