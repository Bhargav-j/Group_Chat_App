const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing (assuming bcrypt is used)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  // Check if the document is being modified after creation
  if (this.isModified()) {
    this.updatedAt = new Date(); // Update the updatedAt field
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
