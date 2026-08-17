const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },

    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 2;
        },
        message: 'Question must have at least 2 options'
      }
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Question', questionSchema);