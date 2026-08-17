const express = require('express');

const {
  submitExam,
  getResultById,
  getResultsByUser,
  deleteResult
} = require('../controllers/result.controller');

const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.post(
  '/submit',
  authMiddleware,
  submitExam
);

router.get(
  '/my-results',
  authMiddleware,
  getResultsByUser
);

router.get(
  '/:resultId',
  authMiddleware,
  getResultById
);

router.delete(
  '/:resultId',
  authMiddleware,
  adminMiddleware,
  deleteResult
);

module.exports = router;