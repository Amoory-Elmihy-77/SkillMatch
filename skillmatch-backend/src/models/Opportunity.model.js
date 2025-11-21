const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Opportunity must have a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Opportunity must have a description"],
    },
    company: {
      type: String,
      required: [true, "Opportunity must be linked to a company"],
      trim: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, "Opportunity must list required skills"],
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
      lowercase: true,
    },
    level: {
      type: String,
      enum: ["junior", "mid", "senior", "internship"],
      default: "junior",
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "remote"],
      default: "full-time",
    },
    salary: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// OpportunitySchema.index({ requiredSkills: 1, tags: 1 });

module.exports = mongoose.model("Opportunity", OpportunitySchema);
