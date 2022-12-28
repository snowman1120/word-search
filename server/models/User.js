const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'seller', 'agent'],
    default: 'seller'
  },
  postalCode: {
    type: String,
  },
  licenseNumber: {
    type: String,
  },
  stateLicensed: {
    type: String,
  },
  yearsOfExprerience: {
    type: String,
  },
  affiliations: {
    type: String,
  },
  notifications: [
    {
      type: {
        type: String,
        enum: ['BID_ON_YOUR_PROPERTY', 'ENDED_YOUR_PROPERTY', 'NEW_PROPERTY', 'WIN_BID']
      },
      message: {
        type: String
      },
      property: {
        type: mongoose.Schema.Types.ObjectId,
      },
      bid: {
        type: mongoose.Schema.Types.ObjectId
      },
      isRead: {
        type: Boolean,
        default: false
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('users', UserSchema);
