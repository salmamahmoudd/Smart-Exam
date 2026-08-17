const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

const {
  register,
  login,
  uploadProfileImage,
  getMe
} = require('../controllers/auth.controller');

router.post('/register', register);

router.post('/login', login);

router.post(
  '/upload-profile',
  authMiddleware,
  upload.single('image'),
  uploadProfileImage
);

router.get(
  '/me',
  authMiddleware,
  getMe
);

module.exports = router;