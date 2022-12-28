const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true
  },
  nonce: {
    type: Number,
    required: true,
    default: Math.floor(Math.random() * 10000)
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('users', UserSchema);
