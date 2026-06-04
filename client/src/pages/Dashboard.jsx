import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const EMPTY_FORM = { title: '', description: '', category: 'computer', price: '', location: '', schedule: { days: [], time: '', duration: '' } }

export default function Dashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'teacher' && user.role !== 'admin') { navigate('/'); return }
    fetchCourses()
  }, [user])

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses/teacher/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(res.data)
    } catch { toast.error('Courses load nahi hue') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post('http://localhost:5000/api/courses', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Course create ho gaya! Admin approval pending hai. ⏳')
      setShowModal(false)
      setForm(EMPTY_FORM)
      fetchCourses()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Course delete karna chahte ho?')) return
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Course delete ho gaya')
      setCourses(c => c.filter(x => x._id !== id))
    } catch { toast.error('Delete nahi hua') }
  }

  const toggleDay = (day) => {
    setForm(p => ({
      ...p,
      schedule: {
        ...p.schedule,
        days: p.schedule.days.includes(day)
          ? p.schedule.days.filter(d => d !== day)
          : [...p.schedule.days, day]
      }
    }))
  }

  const approved = courses.filter(c => c.isApproved)
  const pending = courses.filter(c => !c.isApproved)
  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsEnrolled?.length || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001F5C] to-[#0056D2] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-200 text-sm mb-1">Welcome back,</p>
              <h1 className="text-3xl font-bold text-white">{user?.name} 👋</h1>
              <p className="text-blue-200 text-sm mt-1 capitalize">{user?.role} Dashboard</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-white text-primary font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              New Course Banao
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Courses', value: courses.length, icon: '📚', color: 'text-blue-600 bg-blue-50' },
            { label: 'Live Courses', value: approved.length, icon: '✅', color: 'text-green-600 bg-green-50' },
            { label: 'Pending Approval', value: pending.length, icon: '⏳', color: 'text-amber-600 bg-amber-50' },
            { label: 'Total Students', value: totalStudents, icon: '👥', color: 'text-purple-600 bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-lg">Tumhare Courses</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="font-bold text-slate-700 mb-1">Koi course nahi hai abhi</h3>
              <p className="text-slate-400 text-sm mb-4">Apna pehla course create karo!</p>
              <button onClick={() => setShowModal(true)}
                className="bg-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                Create Course
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Course', 'Category', 'Price', 'Students', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map(course => (
                    <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 text-sm line-clamp-1">{course.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">📍 {course.location}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{course.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {course.price === 0 ? <span className="text-green-600">Free</span> : `₹${course.price}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{course.studentsEnrolled?.length || 0}</td>
                      <td className="px-6 py-4">
                        {course.isApproved ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDelete(course._id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Naya Course Banao</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Course Title', key: 'title', placeholder: 'e.g. Basic Computer Course', type: 'text' },
                { label: 'Location', key: 'location', placeholder: 'e.g. Malegaon, Maharashtra', type: 'text' },
                { label: 'Price (₹)', key: 'price', placeholder: '0 for free', type: 'number' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => setForm(p => ({...p, [field.key]: e.target.value}))}
                    placeholder={field.placeholder}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({...p, description: e.target.value}))}
                  placeholder="Course ke baare mein batao..."
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({...p, category: e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white"
                >
                  {['computer','tailoring','language','coaching','skills','other'].map(c => (
                    <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        form.schedule.days.includes(day)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-primary'
                      }`}>
                      {day.slice(0,3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time</label>
                  <input
                    type="text"
                    value={form.schedule.time}
                    onChange={e => setForm(p => ({...p, schedule: {...p.schedule, time: e.target.value}}))}
                    placeholder="e.g. 5:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={form.schedule.duration}
                    onChange={e => setForm(p => ({...p, schedule: {...p.schedule, duration: e.target.value}}))}
                    placeholder="e.g. 2 months"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                  {submitting ? 'Creating...' : 'Course Banao'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}