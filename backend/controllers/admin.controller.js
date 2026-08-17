const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalExams,
      availableExams,
      lockedExams,
      totalQuestions,
      totalResults
    ] = await Promise.all([
      User.countDocuments({
        role: 'user'
      }),

      User.countDocuments({
        role: 'admin'
      }),

      Exam.countDocuments(),

      Exam.countDocuments({
        status: 'available'
      }),

      Exam.countDocuments({
        status: 'locked'
      }),

      Question.countDocuments(),

      Result.countDocuments()
    ]);

    const averageResult = await Result.aggregate([
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: '$percentage'
          }
        }
      }
    ]);

    const averageScore =
      averageResult.length > 0
        ? Math.round(averageResult[0].averageScore || 0)
        : 0;

    const recentUsers = await User.find({
      role: 'user'
    })
      .select('name email profileImage createdAt')
      .sort({
        createdAt: -1
      })
      .limit(5)
      .lean();

    const recentResults = await Result.find()
      .populate('userId', 'name email')
      .populate('examId', 'title')
      .sort({
        createdAt: -1
      })
      .limit(5)
      .lean();

    const popularExams = await Result.aggregate([
      {
        $group: {
          _id: '$examId',

          attempts: {
            $sum: 1
          },

          averageScore: {
            $avg: '$percentage'
          }
        }
      },

      {
        $sort: {
          attempts: -1
        }
      },

      {
        $limit: 5
      }
    ]);

    const popularExamIds = popularExams.map(
      (item) => item._id
    );

    const popularExamData = await Exam.find({
      _id: {
        $in: popularExamIds
      }
    })
      .select('title status time')
      .lean();

    const popularExamsWithData = popularExams.map(
      (item) => {
        const exam = popularExamData.find(
          (exam) =>
            exam._id.toString() ===
            item._id.toString()
        );

        return {
          _id: item._id,

          title: exam
            ? exam.title
            : 'Unknown Exam',

          status: exam
            ? exam.status
            : 'locked',

          time: exam
            ? exam.time
            : 0,

          attempts: item.attempts,

          averageScore: Math.round(
            item.averageScore || 0
          )
        };
      }
    );

    return res.status(200).json({
      message: 'success',

      stats: {
        totalUsers,
        totalAdmins,
        totalExams,
        availableExams,
        lockedExams,
        totalQuestions,
        totalResults,
        averageScore
      },

      recentUsers,

      recentResults,

      popularExams: popularExamsWithData
    });

  } catch (error) {
    console.error(
      'ADMIN DASHBOARD ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  getDashboardStats
};