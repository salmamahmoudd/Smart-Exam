const express = require('express');

const {
  getQuestionsByExam,
  getAdminQuestionsByExam,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/question.controller');

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get(
  '/exam/:examId',
  getQuestionsByExam
);

router.get(
  '/admin/exam/:examId',
  authMiddleware,
  adminMiddleware,
  getAdminQuestionsByExam
);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  createQuestion
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  updateQuestion
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteQuestion
);

module.exports = router;