const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Please select an opportunity type"],
      enum: ["job", "course", "tool"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    skillsRequired: {
      type: [String],
      default: [],
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        "Web Dev",
        "Design",
        "Video Editing",
        "Writing",
        "Marketing",
        "Other",
      ],
      default: "Other",
    },
    sourceName: String,
    externalLink: {
      type: String,
      required: [true, "Please add an external link"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
