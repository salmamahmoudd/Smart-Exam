const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .sort({
        createdAt: -1
      })
      .lean();

    const examsWithQuestionsCount =
      await Promise.all(
        exams.map(async (exam) => {
          const questionsCount =
            await Question.countDocuments({
              examId: exam._id
            });

          return {
            ...exam,
            questionsCount
          };
        })
      );

    return res.status(200).json(
      examsWithQuestionsCount
    );
  } catch (error) {
    console.error(
      'GET EXAMS ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      time,
      status
    } = req.body;

    if (!title || time === undefined) {
      return res.status(400).json({
        message:
          'Title and time are required'
      });
    }

    const normalizedTitle =
      title.trim();

    const examTime =
      Number(time);

    if (!normalizedTitle) {
      return res.status(400).json({
        message:
          'Exam title is required'
      });
    }

    if (
      !Number.isFinite(examTime) ||
      examTime <= 0
    ) {
      return res.status(400).json({
        message:
          'Time must be a positive number'
      });
    }

    const exam = await Exam.create({
      title: normalizedTitle,

      description:
        description
          ? description.trim()
          : '',

      time: examTime,

      status:
        status || 'available'
    });

    return res.status(201).json({
      message: 'success',
      exam
    });
  } catch (error) {
    console.error(
      'CREATE EXAM ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: 'Invalid exam id'
      });
    }

    const {
      title,
      description,
      time,
      status
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      const normalizedTitle =
        title.trim();

      if (!normalizedTitle) {
        return res.status(400).json({
          message:
            'Exam title is required'
        });
      }

      updateData.title =
        normalizedTitle;
    }

    if (description !== undefined) {
      updateData.description =
        description.trim();
    }

    if (time !== undefined) {
      const examTime =
        Number(time);

      if (
        !Number.isFinite(examTime) ||
        examTime <= 0
      ) {
        return res.status(400).json({
          message:
            'Time must be a positive number'
        });
      }

      updateData.time =
        examTime;
    }

    if (status !== undefined) {
      if (
        !['available', 'locked']
          .includes(status)
      ) {
        return res.status(400).json({
          message:
            'Invalid exam status'
        });
      }

      updateData.status =
        status;
    }

    const exam =
      await Exam.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!exam) {
      return res.status(404).json({
        message:
          'Exam not found'
      });
    }

    return res.status(200).json({
      message: 'success',
      exam
    });
  } catch (error) {
    console.error(
      'UPDATE EXAM ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: 'Invalid exam id'
      });
    }

    const exam =
      await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({
        message:
          'Exam not found'
      });
    }

    await Question.deleteMany({
      examId: exam._id
    });

    return res.status(200).json({
      message:
        'Exam deleted successfully'
    });
  } catch (error) {
    console.error(
      'DELETE EXAM ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  getExams,
  createExam,
  updateExam,
  deleteExam
};