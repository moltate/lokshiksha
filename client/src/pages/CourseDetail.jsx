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
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  const categoryImages = {
    computer: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    tailoring: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    language: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
    coaching: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    skills: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    other: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
  }

  useEffect(() => {
    fetchCourse()
    fetchReviews()
  }, [id])

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`)
      setCourse(res.data)
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

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}/reviews`)
      setReviews(res.data)
    } catch (err) {}
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${id}/reviews`,
        { text: reviewText, rating: reviewRating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Review diya!')
      setReviewText('')
      setReviewRating(5)
      fetchReviews()
      fetchCourse()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kuch galat hua')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0f172a'}}>
      <p className="text-gray-400 text-lg">Loading...</p>
    </div>
  )

  if (!course) return null

  return (
    <div className="min-h-screen" style={{background:'#0f172a'}}>
      {/* Navbar */}
      <nav style={{background:'#1e293b'}} className="px-6 py-4 flex justify-between items-center shadow-lg">
        <Link to="/" className="text-2xl font-bold text-blue-400">LokShiksha</Link>
        <Link to="/courses" className="text-gray-400 hover:text-blue-400">← Wapas Courses</Link>
      </nav>

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={course.thumbnail || categoryImages[course.category] || categoryImages.other}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{background:'linear-gradient(to bottom, transparent, #0f172a)'}} />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 -mt-10 relative">
        <div style={{background:'#1e293b'}} className="rounded-2xl p-8 border border-slate-700 mb-6">

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              {course.category}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              course.isApproved ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'
            }`}>
              {course.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
          <p className="text-gray-400 text-lg mb-6">{course.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Price', value: `₹${course.price}`, color: 'text-green-400' },
              { label: 'Location', value: `📍 ${course.location}`, color: 'text-blue-400' },
              { label: 'Students', value: course.studentsEnrolled?.length || 0, color: 'text-purple-400' },
              { label: 'Rating', value: course.rating?.average > 0 ? `⭐ ${course.rating.average.toFixed(1)}` : 'N/A', color: 'text-yellow-400' },
            ].map(stat => (
              <div key={stat.label} style={{background:'#0f172a'}} className="rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Schedule */}
          {course.schedule?.time && (
            <div className="rounded-xl p-4 mb-6 border border-blue-800" style={{background:'#0f172a'}}>
              <h3 className="font-semibold text-blue-400 mb-2">📅 Schedule</h3>
              <p className="text-gray-300">Time: {course.schedule.time}</p>
              {course.schedule.duration && <p className="text-gray-300">Duration: {course.schedule.duration}</p>}
              {course.schedule.days?.length > 0 && <p className="text-gray-300">Days: {course.schedule.days.join(', ')}</p>}
            </div>
          )}

          {/* Teacher */}
          <div className="rounded-xl p-4 mb-6 border border-slate-600">
            <h3 className="font-semibold text-gray-300 mb-3">👨‍🏫 Teacher</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {course.teacher?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{course.teacher?.name}</p>
                <p className="text-gray-400 text-sm">{course.teacher?.email}</p>
              </div>
            </div>
          </div>

          {/* Enroll */}
          {user?.role === 'student' && (
            <button
              onClick={handleEnroll}
              disabled={enrolling || enrolled}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                enrolled
                  ? 'bg-green-900 text-green-400 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {enrolled ? '✓ Already Enrolled Hain' : enrolling ? 'Enrolling...' : `Enroll Karo — ₹${course.price}`}
            </button>
          )}

          {!user && (
            <Link
              to="/login"
              className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700"
            >
              Login Karo Enroll Ke Liye
            </Link>
          )}
        </div>

        {/* Reviews Section */}
        <div style={{background:'#1e293b'}} className="rounded-2xl p-8 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Reviews ({reviews.length})</h2>

          {/* Review Form */}
          {enrolled && (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 rounded-xl border border-slate-600" style={{background:'#0f172a'}}>
              <h3 className="text-gray-300 font-semibold mb-3">Apna Review Do</h3>
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl transition ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-600'}`}
                  >★</button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                rows={3}
                placeholder="Course ke baare mein likho..."
                style={{background:'#1e293b', borderColor:'#334155'}}
                className="w-full border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {submittingReview ? 'Submit...' : 'Review Do'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Abhi koi review nahi hai</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} style={{background:'#0f172a'}} className="rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {review.user?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-gray-300 font-semibold">{review.user?.name}</span>
                    </div>
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}