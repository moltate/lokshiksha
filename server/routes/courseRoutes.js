const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);

router.post('/', protect, restrictTo('teacher', 'admin'), createCourse);
router.put('/:id', protect, restrictTo('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, restrictTo('teacher', 'admin'), deleteCourse);
router.get('/teacher/my-courses', protect, restrictTo('teacher', 'admin'), getMyCourses);

module.exports = router;