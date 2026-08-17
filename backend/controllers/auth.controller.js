const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const normalizedName = name.trim();

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    if (
      normalizedName.length < 3 ||
      normalizedName.length > 50
    ) {
      return res.status(400).json({
        message:
          'Name must be between 3 and 50 characters'
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please enter a valid email'
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be 6-20 characters and contain letters and numbers'
      });
    }

    const userExist = await User.findOne({
      email: normalizedEmail
    });

    if (userExist) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'success',
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          'Email and password are required'
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please enter a valid email'
      });
    }

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message:
          'Invalid email or password'
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt
          ? user.createdAt.toString()
          : null
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    return res.status(200).json({
      message: 'success',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('GET ME ERROR:', error);

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const uploadProfileImage = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload an image'
      });
    }

    user.profileImage = req.file.filename;

    await user.save();

    return res.status(200).json({
      message:
        'Profile image uploaded successfully',
      image: req.file.filename
    });
  } catch (error) {
    console.error(
      'UPLOAD PROFILE IMAGE ERROR:',
      error
    );

    return res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  uploadProfileImage,
  getMe
};