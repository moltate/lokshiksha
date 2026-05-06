import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'computer',
    price: '', location: '', schedule: { days: [], time: '', duration: '' }
  })

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/')
      return
    }
    fetchMyCourses()
  }, [user])

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses/teacher/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(res.data)
    } catch (err) {
      toast.error('Courses load nahi hue')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Course ban gaya!')
      setShowForm(false)
      setFormData({
        title: '', description: '', category: 'computer',
        price: '', location: '', schedule: { days: [], time: '', duration: '' }
      })
      fetchMyCourses()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kuch galat hua')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Pakka delete karna hai?')) return
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Course delete ho gaya!')
      fetchMyCourses()
    } catch (err) {
      toast.error('Delete nahi hua')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">LokShiksha</h1>
        <span className="text-gray-600">Teacher Dashboard — {user?.name}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mere Courses</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Naya Course'}
          </button>
        </div>

        {/* Course Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Naya Course Banao</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Course ka naam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="computer">Computer</option>
                    <option value="tailoring">Tailoring</option>
                    <option value="language">Language</option>
                    <option value="coaching">Coaching</option>
                    <option value="skills">Skills</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Malegaon, Maharashtra"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Course ke baare mein batao..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Course Banao
              </button>
            </form>
          </div>
        )}

        {/* Courses List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Abhi koi course nahi hai</p>
            <p className="text-sm">Upar "+ Naya Course" dabao</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">{course.title}</h3>
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-3">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">₹{course.price}</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${course.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {course.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}