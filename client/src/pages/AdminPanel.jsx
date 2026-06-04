import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const API = 'http://localhost:5000/api/admin'

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value ?? '—'}</div>
      <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
    </div>
  )
}

export default function AdminPanel() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [pendingCourses, setPendingCourses] = useState([])
  const [pendingTeachers, setPendingTeachers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'admin') { navigate('/'); return }
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statsRes, coursesRes, teachersRes, usersRes] = await Promise.all([
        axios.get(`${API}/stats`, { headers }),
        axios.get(`${API}/pending-courses`, { headers }),
        axios.get(`${API}/pending-teachers`, { headers }),
        axios.get(`${API}/users`, { headers }),
      ])
      setStats(statsRes.data)
      setPendingCourses(coursesRes.data)
      setPendingTeachers(teachersRes.data)
      setAllUsers(usersRes.data)
    } catch {
      toast.error('Data load nahi hua')
    } finally {
      setLoading(false)
    }
  }

  const approveCourse = async (id) => {
    try {
      await axios.patch(`${API}/courses/${id}/approve`, {}, { headers })
      toast.success('Course approved! ✅')
      setPendingCourses(p => p.filter(c => c._id !== id))
      setStats(s => ({ ...s, pendingCourses: s.pendingCourses - 1, approvedCourses: s.approvedCourses + 1 }))
    } catch { toast.error('Error') }
  }

  const rejectCourse = async (id) => {
    try {
      await axios.patch(`${API}/courses/${id}/reject`, {}, { headers })
      toast.success('Course rejected')
      setPendingCourses(p => p.filter(c => c._id !== id))
      setStats(s => ({ ...s, pendingCourses: s.pendingCourses - 1 }))
    } catch { toast.error('Error') }
  }

  const approveTeacher = async (id) => {
    try {
      await axios.patch(`${API}/users/${id}/approve`, {}, { headers })
      toast.success('Teacher approved! ✅')
      setPendingTeachers(p => p.filter(t => t._id !== id))
      setStats(s => ({ ...s, pendingTeachers: s.pendingTeachers - 1 }))
    } catch { toast.error('Error') }
  }

  const rejectTeacher = async (id) => {
    try {
      await axios.patch(`${API}/users/${id}/reject`, {}, { headers })
      toast.success('Teacher rejected')
      setPendingTeachers(p => p.filter(t => t._id !== id))
    } catch { toast.error('Error') }
  }

  const deleteUser = async (id) => {
    if (!confirm('User delete karna chahte ho?')) return
    try {
      await axios.delete(`${API}/users/${id}`, { headers })
      toast.success('User deleted')
      setAllUsers(p => p.filter(u => u._id !== id))
    } catch { toast.error('Error') }
  }

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'courses', label: `⏳ Pending Courses ${pendingCourses.length > 0 ? `(${pendingCourses.length})` : ''}` },
    { id: 'teachers', label: `👨‍🏫 Pending Teachers ${pendingTeachers.length > 0 ? `(${pendingTeachers.length})` : ''}` },
    { id: 'users', label: '👥 All Users' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              👑
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400 text-sm">LokShiksha ka poora control yahan hai</p>
            </div>
            {(stats?.pendingCourses > 0 || stats?.pendingTeachers > 0) && (
              <div className="ml-auto flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                {(stats.pendingCourses + stats.pendingTeachers)} pending approvals
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8 bg-white border border-slate-200 rounded-2xl p-1.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {tab === 'overview' && stats && (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="bg-blue-50 text-blue-600" />
                  <StatCard icon="🎓" label="Students" value={stats.totalStudents} color="bg-green-50 text-green-600" />
                  <StatCard icon="👨‍🏫" label="Teachers" value={stats.totalTeachers} color="bg-purple-50 text-purple-600" />
                  <StatCard icon="📚" label="Total Courses" value={stats.totalCourses} color="bg-amber-50 text-amber-600" />
                  <StatCard icon="✅" label="Live Courses" value={stats.approvedCourses} color="bg-emerald-50 text-emerald-600" />
                  <StatCard icon="⏳" label="Pending Courses" value={stats.pendingCourses} color="bg-orange-50 text-orange-600" />
                  <StatCard icon="🔔" label="Pending Teachers" value={stats.pendingTeachers} color="bg-red-50 text-red-600" />
                  <StatCard icon="⭐" label="Total Reviews" value={stats.totalReviews} color="bg-yellow-50 text-yellow-600" />
                </div>

                {/* Quick Actions */}
                {(stats.pendingCourses > 0 || stats.pendingTeachers > 0) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <h3 className="font-bold text-amber-800 mb-3">⚠️ Action Required</h3>
                    <div className="flex flex-wrap gap-3">
                      {stats.pendingCourses > 0 && (
                        <button onClick={() => setTab('courses')}
                          className="bg-amber-500 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-amber-600 transition-colors">
                          {stats.pendingCourses} courses approve karo →
                        </button>
                      )}
                      {stats.pendingTeachers > 0 && (
                        <button onClick={() => setTab('teachers')}
                          className="bg-red-500 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition-colors">
                          {stats.pendingTeachers} teachers approve karo →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PENDING COURSES TAB */}
            {tab === 'courses' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="font-bold text-slate-800 text-lg">Pending Course Approvals</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Yeh courses live hone ke liye approval ka wait kar rahe hain</p>
                </div>
                {pendingCourses.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-slate-500 font-medium">Sab courses approve ho gaye!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingCourses.map(course => (
                      <div key={course._id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="capitalize text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">{course.category}</span>
                              <span className="text-xs text-slate-400">{new Date(course.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-base">{course.title}</h3>
                            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{course.description}</p>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                              <span>👨‍🏫 {course.teacher?.name}</span>
                              <span>📍 {course.location}</span>
                              <span>💰 {course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => rejectCourse(course._id)}
                              className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors">
                              Reject
                            </button>
                            <button onClick={() => approveCourse(course._id)}
                              className="px-4 py-2 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors">
                              Approve ✓
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PENDING TEACHERS TAB */}
            {tab === 'teachers' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="font-bold text-slate-800 text-lg">Pending Teacher Approvals</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Yeh teachers platform pe teach karna chahte hain</p>
                </div>
                {pendingTeachers.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-slate-500 font-medium">Koi pending teacher nahi!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingTeachers.map(teacher => (
                      <div key={teacher._id} className="p-6 flex items-center justify-between gap-4 flex-wrap hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shrink-0">
                            {teacher.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{teacher.name}</p>
                            <p className="text-slate-400 text-sm">{teacher.email}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Joined {new Date(teacher.createdAt).toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => rejectTeacher(teacher._id)}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors">
                            Reject
                          </button>
                          <button onClick={() => approveTeacher(teacher._id)}
                            className="px-4 py-2 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors">
                            Approve ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ALL USERS TAB */}
            {tab === 'users' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-800 text-lg">All Users</h2>
                    <p className="text-slate-400 text-sm mt-0.5">Total {allUsers.length} users registered</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {['User', 'Email', 'Role', 'Status', 'Joined', 'Action'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allUsers.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-800 text-sm">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`capitalize text-xs font-semibold px-2.5 py-1 rounded-full ${
                              u.role === 'admin' ? 'bg-red-50 text-red-700' :
                              u.role === 'teacher' ? 'bg-purple-50 text-purple-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              u.isApproved
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {u.isApproved ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4">
                            {u.role !== 'admin' && (
                              <button onClick={() => deleteUser(u._id)}
                                className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}