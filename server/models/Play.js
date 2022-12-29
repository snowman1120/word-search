const mongoose = require('mongoose');

const PlaySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
  }
});

module.exports = mongoose.model('plays', PlaySchema);
