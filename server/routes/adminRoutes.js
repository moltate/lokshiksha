const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/authMiddleware')
const {
  getAllUsers,
  approveTeacher,
  rejectTeacher,
  approveCourse,
  rejectCourse,
  getPendingCourses,
  getPendingTeachers,
  getDashboardStats,
  deleteUser,
} = require('../controllers/adminController')

const admin = [protect, restrictTo('admin')]

router.get('/stats', admin, getDashboardStats)
router.get('/users', admin, getAllUsers)
router.get('/pending-teachers', admin, getPendingTeachers)
router.get('/pending-courses', admin, getPendingCourses)
router.patch('/users/:id/approve', admin, approveTeacher)
router.patch('/users/:id/reject', admin, rejectTeacher)
router.patch('/courses/:id/approve', admin, approveCourse)
router.patch('/courses/:id/reject', admin, rejectCourse)
router.delete('/users/:id', admin, deleteUser)

module.exports = router