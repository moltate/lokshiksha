import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function CourseDetail() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`)
      setCourse(res.data)
      // Check karo student enrolled hai ya nahi
      if (user && res.data.studentsEnrolled?.includes(user.id)) {
        setEnrolled(true)
      }
    } catch (err) {
      toast.error('Course nahi mila')
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Pehle login karo!')
      navigate('/login')
      return
    }
    setEnrolling(true)
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Enrolled ho gaye!')
      setEnrolled(true)
      fetchCourse()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kuch galat hua')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  if (!course) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">LokShiksha</Link>
        <Link to="/courses" className="text-gray-600 hover:text-blue-600">← Wapas Courses</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              course.isApproved
                ? 'bg-green-100 text-green-600'
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {course.isApproved ? '✓ Approved' : '⏳ Pending'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-6">{course.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-2xl font-bold text-green-600">₹{course.price}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">Location</p>
              <p className="font-semibold text-gray-700">📍 {course.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {course.studentsEnrolled?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">Rating</p>
              <p className="text-2xl font-bold text-yellow-500">
                {course.rating?.average > 0 ? `⭐ ${course.rating.average}` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Schedule */}
          {course.schedule?.time && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-700 mb-2">📅 Schedule</h3>
              <p className="text-gray-600">Time: {course.schedule.time}</p>
              {course.schedule.duration && (
                <p className="text-gray-600">Duration: {course.schedule.duration}</p>
              )}
              {course.schedule.days?.length > 0 && (
                <p className="text-gray-600">Days: {course.schedule.days.join(', ')}</p>
              )}
            </div>
          )}

          {/* Teacher Info */}
          <div className="border border-gray-100 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">👨‍🏫 Teacher</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {course.teacher?.name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{course.teacher?.name}</p>
                <p className="text-gray-500 text-sm">{course.teacher?.email}</p>
              </div>
            </div>
          </div>

          {/* Enroll Button */}
          {user?.role === 'student' && (
            <button
              onClick={handleEnroll}
              disabled={enrolling || enrolled}
              className={`w-full py-3 rounded-xl font-bold text-lg transition ${
                enrolled
                  ? 'bg-green-100 text-green-600 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {enrolled ? '✓ Already Enrolled Ho' : enrolling ? 'Enrolling...' : `Enroll Karo — ₹${course.price}`}
            </button>
          )}

          {!user && (
            <Link
              to="/login"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700"
            >
              Login Karo Enroll Ke Liye
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}