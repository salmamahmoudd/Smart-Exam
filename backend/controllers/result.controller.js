const mongoose = require('mongoose');
const Question = require('../models/Question');
const Result = require('../models/Result');
const Exam = require('../models/Exam');

const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const userId = req.user.id;

    if (!examId || !answers) {
      return res.status(400).json({
        message: 'examId and answers are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({
        message: 'Invalid exam id'
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: 'Answers must be an array'
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
    });

    if (!questions.length) {
      return res.status(404).json({
        message: 'No questions found for this exam'
      });
    }

    let correctAnswers = 0;

    questions.forEach((question) => {
      const userAnswer = answers.find(
        (answer) =>
          answer &&
          answer.questionId &&
          answer.questionId.toString() ===
            question._id.toString()
      );

      if (
        userAnswer &&
        userAnswer.answer === question.correctAnswer
      ) {
        correctAnswers++;
      }
    });

    const totalQuestions = questions.length;

    const wrongAnswers =
      totalQuestions - correctAnswers;

    const percentage =
      (correctAnswers / totalQuestions) * 100;

    const result = await Result.create({
      userId,
      examId,
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage: Math.round(percentage)
    });

    return res.status(201).json({
      message: 'Exam submitted successfully',
      result
    });

  } catch (error) {
    console.error(
      'SUBMIT EXAM ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({
        message: 'Invalid result id'
      });
    }

    const result = await Result.findById(resultId)
      .populate('examId', 'title time')
      .populate('userId', 'name email');

    if (!result) {
      return res.status(404).json({
        message: 'Result not found'
      });
    }

    const isOwner =
      result.userId &&
      result.userId._id.toString() ===
        req.user.id;

    const isAdmin =
      req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    return res.status(200).json({
      message: 'success',
      result
    });

  } catch (error) {
    console.error(
      'GET RESULT ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const getResultsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await Result.find({
      userId
    })
      .populate('examId', 'title time')
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      message: 'success',
      results
    });

  } catch (error) {
    console.error(
      'GET USER RESULTS ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const deleteResult = async (req, res) => {
  try {
    const { resultId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({
        message: 'Invalid result id'
      });
    }

    const result =
      await Result.findByIdAndDelete(resultId);

    if (!result) {
      return res.status(404).json({
        message: 'Result not found'
      });
    }

    return res.status(200).json({
      message: 'Result deleted successfully'
    });

  } catch (error) {
    console.error(
      'DELETE RESULT ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  submitExam,
  getResultById,
  getResultsByUser,
  deleteResult
};