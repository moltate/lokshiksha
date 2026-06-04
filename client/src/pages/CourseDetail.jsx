import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110">
          <svg className={`w-7 h-7 ${s <= (hover || value) ? 'fill-amber-400' : 'fill-slate-200'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function CourseDetail() {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 0, text: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  const isEnrolled = user && course?.studentsEnrolled?.includes(user.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${id}`),
          axios.get(`http://localhost:5000/api/courses/${id}/reviews`),
        ])
        setCourse(courseRes.data)
        setReviews(reviewsRes.data)
      } catch {
        toast.error('Course nahi mila')
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return }
    setEnrolling(true)
    try {
      await axios.post(`http://localhost:5000/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Successfully enrolled! 🎉')
      setCourse(prev => ({ ...prev, studentsEnrolled: [...prev.studentsEnrolled, user.id] }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed')
    } finally {
      setEnrolling(false)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!reviewForm.rating) { toast.error('Rating select karo'); return }
    setSubmittingReview(true)
    try {
      const res = await axios.post(`http://localhost:5000/api/courses/${id}/reviews`, reviewForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviews(prev => [res.data, ...prev])
      setReviewForm({ rating: 0, text: '' })
      toast.success('Review submit ho gaya! ⭐')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review submit failed')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-10 h-10 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span className="text-slate-500 text-sm">Course load ho raha hai...</span>
      </div>
    </div>
  )

  if (!course) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#001F5C] to-[#0056D2] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize mb-4">{course.category}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">{course.title}</h1>
            <p className="text-blue-200 text-base mb-6 leading-relaxed">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200">
              {course.rating?.count > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">{course.rating.average.toFixed(1)}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(course.rating.average) ? 'fill-amber-400' : 'fill-white/30'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span>({course.rating.count} reviews)</span>
                </div>
              )}
              <span>👥 {course.studentsEnrolled?.length || 0} students enrolled</span>
              <span>📍 {course.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schedule */}
            {course.schedule && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">📅 Schedule</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {course.schedule.days?.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 font-medium mb-1">DAYS</p>
                      <p className="font-semibold text-slate-700 text-sm">{course.schedule.days.join(', ')}</p>
                    </div>
                  )}
                  {course.schedule.time && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 font-medium mb-1">TIME</p>
                      <p className="font-semibold text-slate-700 text-sm">{course.schedule.time}</p>
                    </div>
                  )}
                  {course.schedule.duration && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 font-medium mb-1">DURATION</p>
                      <p className="font-semibold text-slate-700 text-sm">{course.schedule.duration}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Teacher */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">👨‍🏫 Tumhara Teacher</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
                  {course.teacher?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base">{course.teacher?.name}</p>
                  <p className="text-slate-500 text-sm">{course.teacher?.email}</p>
                  <span className="inline-block mt-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">Verified Teacher ✓</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5">⭐ Student Reviews ({reviews.length})</h2>

              {/* Add Review */}
              {user?.role === 'student' && isEnrolled && (
                <form onSubmit={handleReview} className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-700 mb-3 text-sm">Apna Review Do</h3>
                  <StarPicker value={reviewForm.rating} onChange={r => setReviewForm(p => ({...p, rating: r}))} />
                  <textarea
                    value={reviewForm.text}
                    onChange={e => setReviewForm(p => ({...p, text: e.target.value}))}
                    placeholder="Tumhara experience kya raha? (optional)"
                    rows={3}
                    className="w-full mt-3 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm resize-none"
                  />
                  <button type="submit" disabled={submittingReview}
                    className="mt-3 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {submittingReview ? 'Submitting...' : 'Review Submit Karo'}
                  </button>
                </form>
              )}

              {reviews.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">Abhi koi review nahi. Pehle review do! 🌟</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {r.user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800 text-sm">{r.user?.name}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400' : 'fill-slate-200'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-6xl">
                  {course.category === 'computer' ? '💻' : course.category === 'tailoring' ? '✂️' : course.category === 'language' ? '🗣️' : '📚'}
                </span>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  {course.price === 0 ? (
                    <span className="text-3xl font-bold text-green-600">Free</span>
                  ) : (
                    <span className="text-3xl font-bold text-slate-900">₹{course.price}</span>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="w-full bg-green-50 border border-green-200 text-green-700 font-bold py-3.5 rounded-xl text-center text-sm">
                    ✅ Enrolled Ho Gaye!
                  </div>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/30 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                    {enrolling ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Enrolling...
                      </>
                    ) : user ? 'Abhi Enroll Karo' : 'Login Karke Enroll Karo'}
                  </button>
                )}

                <div className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {[
                    ['📍', 'Location', course.location],
                    ['👥', 'Enrolled', `${course.studentsEnrolled?.length || 0} students`],
                    ['⭐', 'Rating', course.rating?.count > 0 ? `${course.rating.average.toFixed(1)}/5` : 'No ratings yet'],
                  ].map(([icon, label, value]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-400">{icon} {label}</span>
                      <span className="font-semibold text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}