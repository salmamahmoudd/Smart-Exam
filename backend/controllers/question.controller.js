const mongoose = require('mongoose');
const Question = require('../models/Question');
const Exam = require('../models/Exam');

const getQuestionsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({
        message: 'Invalid exam id'
      });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    const questions = await Question.find({
      examId
    }).select('-correctAnswer');

    res.status(200).json(questions);
  } catch (error) {
    console.error(
      'GET QUESTIONS ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server error'
    });
  }
};

const getAdminQuestionsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({
        message: 'Invalid exam id'
      });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    const questions = await Question.find({
      examId
    }).sort({
      createdAt: 1
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error(
      'GET ADMIN QUESTIONS ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server error'
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const {
      examId,
      question,
      options,
      correctAnswer
    } = req.body;

    if (
      !examId ||
      !question ||
      !options ||
      !correctAnswer
    ) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({
        message: 'Invalid exam id'
      });
    }

    if (
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        message:
          'At least 2 options are required'
      });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        message:
          'Correct answer must be one of the options'
      });
    }

    const newQuestion =
      await Question.create({
        examId,
        question: question.trim(),
        options,
        correctAnswer
      });

    res.status(201).json({
      message:
        'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    console.error(
      'CREATE QUESTION ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server error'
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid question id'
      });
    }

    const question =
      await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        message: 'Question not found'
      });
    }

    res.status(200).json({
      message:
        'Question deleted successfully'
    });
  } catch (error) {
    console.error(
      'DELETE QUESTION ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server error'
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      question,
      options,
      correctAnswer
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid question id'
      });
    }

    if (
      !question ||
      !options ||
      !correctAnswer
    ) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        message:
          'At least 2 options are required'
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        message:
          'Correct answer must be one of the options'
      });
    }

    const updatedQuestion =
      await Question.findByIdAndUpdate(
        id,
        {
          question: question.trim(),
          options,
          correctAnswer
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedQuestion) {
      return res.status(404).json({
        message: 'Question not found'
      });
    }

    res.status(200).json({
      message:
        'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    console.error(
      'UPDATE QUESTION ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  getQuestionsByExam,
  getAdminQuestionsByExam,
  createQuestion,
  updateQuestion,
  deleteQuestion
};