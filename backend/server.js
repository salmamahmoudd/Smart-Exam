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


app.use((req, res, next) => {
  const origin = req.headers.origin;

  const isAllowed =
    !origin ||
    origin === 'http://localhost:4200' ||
    origin === 'https://smart-exam-eight.vercel.app' ||
    /^https:\/\/smart-exam-[a-z0-9]+-salmamahmoudds-projects\.vercel\.app$/.test(origin);

  if (isAllowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});


app.use(express.json());

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);


connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.status(200).send('API Running');
});


app.use((req, res) => {
  res.status(404).json({
    message: 'API Route Not Found'
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: 'CORS Error'
    });
  }

  res.status(500).json({
    message: err.message || 'Something went wrong'
  });
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
