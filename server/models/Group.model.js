const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3, // Minimum group name length (optional)
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

groupSchema.pre('save', function(next) {
  // Check if the document is being modified after creation
  if (this.isModified()) {
    this.updatedAt = new Date(); // Update the updatedAt field
  }
  next();
});

module.exports = mongoose.model('Group', groupSchema);
