const express = require('express');

const {
  getExams,
  createExam,
  updateExam,
  deleteExam
} = require('../controllers/exam.controller');

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get(
  '/',
  getExams
);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  createExam
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  updateExam
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteExam
);

module.exports = router;