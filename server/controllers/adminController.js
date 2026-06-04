const User = require('../models/User')
const Course = require('../models/Course')
const Review = require('../models/Review')

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses, pendingCourses, pendingTeachers, totalReviews] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ isApproved: false }),
      User.countDocuments({ role: 'teacher', isApproved: false }),
      Review.countDocuments(),
    ])
    const totalStudents = await User.countDocuments({ role: 'student' })
    const totalTeachers = await User.countDocuments({ role: 'teacher' })
    const approvedCourses = await Course.countDocuments({ isApproved: true })

    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      approvedCourses,
      pendingCourses,
      pendingTeachers,
      totalReviews,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getPendingTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher', isApproved: false }).select('-password')
    res.json(teachers)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: false })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 })
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.approveTeacher = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User nahi mila' })
    res.json({ message: 'Teacher approved!', user })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.rejectTeacher = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User nahi mila' })
    res.json({ message: 'Teacher rejected', user })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.approveCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('teacher', 'name email')
    if (!course) return res.status(404).json({ message: 'Course nahi mila' })
    res.json({ message: 'Course approved!', course })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.rejectCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    )
    if (!course) return res.status(404).json({ message: 'Course nahi mila' })
    res.json({ message: 'Course rejected', course })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User nahi mila' })
    if (user.role === 'admin') return res.status(403).json({ message: 'Admin ko delete nahi kar sakte' })
    await user.deleteOne()
    res.json({ message: 'User delete ho gaya' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}