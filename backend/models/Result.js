const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },

    score: {
      type: Number,
      required: true,
      min: 0
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1
    },

    correctAnswers: {
      type: Number,
      required: true,
      min: 0
    },

    wrongAnswers: {
      type: Number,
      required: true,
      min: 0
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Result', resultSchema);