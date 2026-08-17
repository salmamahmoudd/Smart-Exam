# 🎓 Smart Exam

**Smart Exam** is a full-stack online examination and management platform designed to provide a smooth and organized experience for both **students** and **administrators**.

The platform allows students to browse available exams, take timed quizzes, and track their performance, while administrators can manage users, exams, questions, and results through a dedicated dashboard.

---

## ✨ Features

### 👨‍🎓 Student Features

* 🔐 User registration and login
* 📚 Browse available exams
* 🔒 Locked and available exam status
* ⏱️ Timed examinations
* 📝 Multiple-choice questions
* 📊 View exam results
* 📈 Track average and highest scores
* 📋 View previous exam history
* 👤 Student profile and account information

### 👨‍💼 Admin Features

* 📊 Admin dashboard with platform statistics
* 👥 Manage users
* 📝 Create and manage exams
* ❓ Add and manage exam questions
* 📊 Review student results
* 📈 View exam performance and statistics
* 🔐 Admin authentication and protected routes
* ⚙️ Administrator profile and account management

---

## 🛠️ Technologies Used

### Frontend

* Angular
* TypeScript
* HTML5
* CSS3
* Angular Router
* Angular HttpClient

### Backend

* Node.js
* Express.js
* MongoDB
* RESTful APIs
* JWT Authentication

---

## 🖥️ Screenshots

### 🔐 Authentication

#### Login

![Login](screenshots/login.png)

---

### 👨‍🎓 Student Dashboard

![Student Dashboard](screenshots/student-dashboard.png)

### 📚 Available Exams

![Available Exams](screenshots/exams.png)

### 📝 Take an Exam

![Exam Questions](screenshots/exam.png)

### 📊 Exam Results

![Results](screenshots/results.png)

---

### 👨‍💼 Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### 📝 Manage Exams

![Manage Exams](screenshots/manage-exams.png)

---

## 📁 Project Structure

```text
Smart-Exam/
│
├── frontend/
│   └── Angular application
│
├── backend/
│   └── Node.js / Express application
│
├── screenshots/
│   ├── login.png
│   ├── student-dashboard.png
│   ├── exams.png
│   ├── exam.png
│   ├── results.png
│   ├── admin-dashboard.png
│   └── manage-exams.png
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/salmamahmoudd/Smart-Exam.git
```

```bash
cd Smart-Exam
```

### 2. Run the Backend

```bash
cd backend
npm install
```

Configure your environment variables, then start the backend:

```bash
npm start
```

---

### 3. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the Angular development server:

```bash
ng serve
```

Then open:

```text
http://localhost:4200
```

---

## 🔐 Authentication & Authorization

Smart Exam uses authentication and protected routes to separate access between:

* 👨‍🎓 Students
* 👨‍💼 Administrators

Administrators have access to management features, while students can access exams and their personal results.

---

## 🎯 Project Goals

The project was built to practice and demonstrate full-stack web development concepts, including:

* Building a complete Angular application
* Developing RESTful backend APIs
* Connecting frontend and backend
* Working with MongoDB
* Implementing authentication and authorization
* Managing application state and user data
* Creating responsive and modern user interfaces
* Building separate workflows for students and administrators

---

## 👩‍💻 Author

**Salma Mahmoud**

Full-Stack Web Development Project

---

## ⭐ Project

If you find this project useful or interesting, feel free to give it a ⭐ on GitHub!
