const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },

    description: {
      type: String,
      default: '',
      trim: true
    },

    time: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ['available', 'locked'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Exam', examSchema);