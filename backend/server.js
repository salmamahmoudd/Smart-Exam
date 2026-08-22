const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const questionRoutes = require('./routes/question.routes');
const resultRoutes = require('./routes/result.routes');
const adminRoutes = require('./routes/admin.routes');
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin',adminRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'API Route Not Found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message:
      err.message ||
      'Something went wrong'
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});