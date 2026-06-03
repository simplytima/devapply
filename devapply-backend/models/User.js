const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    resetPasswordToken: {
    type: String,
    default: '',
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

// NO pre-save middleware here - we'll hash in the route instead

module.exports = mongoose.model('User', userSchema);