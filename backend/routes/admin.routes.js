const express = require('express');

const {
  getDashboardStats
} = require('../controllers/admin.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

const adminMiddleware =
  require('../middleware/admin.middleware');

const router = express.Router();

router.get(
  '/dashboard',
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

module.exports = router;