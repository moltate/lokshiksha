<div align="center">

# 📚 LokShiksha

### Apne Sheher Mein Sikhao, Apne Sheher Mein Seekho

A full-stack ed-tech platform connecting local teachers and students in tier-3 cities of India — built with the MERN stack.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933.svg)](https://nodejs.org)

</div>

---

## 🌍 The Problem

In cities like Malegaon, skilled local teachers exist — but there is no structured way for students to discover them, book sessions, or communicate with them. LokShiksha bridges that gap with technology.

---

## ✨ Features (Implemented)

### 🔐 Authentication & Role System
- JWT-based auth with 3 roles: **Student**, **Teacher**, **Admin**
- Secure password hashing with bcrypt
- Protected routes — middleware blocks unauthorized access
- Persistent login via localStorage + React Context

### 📖 Course Management
- Teachers can create, update, and delete courses
- Courses have title, description, category, price, location, and schedule
- Category-based filtering + keyword search
- Courses require Admin approval before going live

### 🎓 Student Features
- Browse all approved courses with search & filter
- Enroll in courses (one-click)
- View detailed course info — teacher profile, schedule, student count, rating

### ⭐ Reviews & Ratings
- Enrolled students can leave a review + star rating
- Average rating auto-calculated and displayed on course cards
- One review per student per course

### 🖥️ Teacher Dashboard
- View all personal courses with approval status
- Create new courses directly from the dashboard
- Delete courses

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcrypt |
| Real-time | Socket.io (in progress) |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Dev Tools | Nodemon, Thunder Client |

---

## 📁 Project Structure

```
lokshiksha/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx       # Global auth state
│       ├── pages/
│       │   ├── Home.jsx              # Landing page
│       │   ├── Login.jsx             # Login page
│       │   ├── Register.jsx          # Register page
│       │   ├── Courses.jsx           # Course listing + search
│       │   ├── CourseDetail.jsx      # Course detail + enroll + reviews
│       │   └── Dashboard.jsx         # Teacher dashboard
│       └── App.jsx                   # Routes
│
└── server/                   # Node.js + Express backend
    ├── models/
    │   ├── User.js                   # User schema (3 roles)
    │   ├── Course.js                 # Course schema
    │   └── Review.js                 # Review schema
    ├── controllers/
    │   ├── authController.js         # Register, Login, GetMe
    │   └── courseController.js       # CRUD + Enroll + Reviews
    ├── middleware/
    │   └── authMiddleware.js         # protect + restrictTo
    ├── routes/
    │   ├── authRoutes.js
    │   └── courseRoutes.js
    └── index.js                      # Express server + Socket.io setup
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/moltate/lokshiksha.git
cd lokshiksha
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lokshiksha
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login + get JWT |
| GET | `/me` | Protected | Get current user |

### Course Routes — `/api/courses`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List all approved courses (supports `?search=&category=`) |
| GET | `/:id` | Public | Get course details |
| POST | `/` | Teacher/Admin | Create new course |
| PUT | `/:id` | Teacher/Admin | Update course |
| DELETE | `/:id` | Teacher/Admin | Delete course |
| GET | `/teacher/my-courses` | Teacher/Admin | Get own courses |
| POST | `/:id/enroll` | Student | Enroll in a course |
| GET | `/:id/reviews` | Public | Get course reviews |
| POST | `/:id/reviews` | Student (enrolled) | Add a review |

---

## 🗺️ Roadmap

- [x] JWT Authentication with 3 roles
- [x] Course CRUD (Teacher)
- [x] Course listing with search & filter
- [x] Student enrollment
- [x] Reviews & Ratings
- [x] Dark theme UI
- [ ] Real-time Chat (Socket.io)
- [ ] Admin Panel (approve teachers & courses)
- [ ] Cloudinary image uploads
- [ ] Razorpay payment integration
- [ ] Mobile responsive polish

---

## 👤 Author

**Ankit Pandey**
- GitHub: [@moltate](https://github.com/moltate)

---
