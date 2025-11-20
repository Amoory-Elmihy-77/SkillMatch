const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    opportunity: {
      type: mongoose.Schema.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    type: {
      type: String,
      enum: ["click", "save", "apply"],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

interactionSchema.index({ user: 1, opportunity: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Interaction", interactionSchema);
