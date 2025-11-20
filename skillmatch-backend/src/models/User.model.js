const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
      maxlength: [30, "Username cannot be more than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot be more than 200 characters"],
      default: "",
    },
    location: String,
    skills: {
      type: [String],
      default: [],
      lowercase: true,
    },
    interests: {
      type: [String],
      default: [],
      lowercase: true,
    },
    profileImage: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
