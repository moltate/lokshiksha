import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const categoryImages = {
  computer: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  tailoring: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
  language: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80',
  coaching: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
  skills: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
  other: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
}

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [search, category])

  const fetchCourses = async () => {
    try {
      let url = 'http://localhost:5000/api/courses?'
      if (search) url += `search=${search}&`
      if (category) url += `category=${category}`
      const res = await axios.get(url)
      setCourses(res.data)
    } catch (err) {
      toast.error('Courses load nahi hue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{background: '#0f172a'}}>
      {/* Navbar */}
      <nav style={{background: '#1e293b'}} className="px-6 py-4 flex justify-between items-center shadow-lg">
        <Link to="/" className="text-2xl font-bold text-blue-400">LokShiksha</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-gray-400 hover:text-blue-400">Home</Link>
          {user ? (
            <span className="text-blue-400 font-semibold">Namaste, {user.name}!</span>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">Saare Courses</h2>
          <p className="text-gray-400">Apne sheher ke best teachers se seekho</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Course dhundo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{background: '#1e293b', borderColor: '#334155'}}
            className="flex-1 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{background: '#1e293b', borderColor: '#334155'}}
            className="border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Saari Categories</option>
            <option value="computer">Computer</option>
            <option value="tailoring">Tailoring</option>
            <option value="language">Language</option>
            <option value="coaching">Coaching</option>
            <option value="skills">Skills</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Koi course nahi mila</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course._id}
                style={{background: '#1e293b'}}
                className="rounded-2xl overflow-hidden hover:shadow-blue-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Course Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.thumbnail || categoryImages[course.category] || categoryImages.other}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {course.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                  {/* Teacher */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {course.teacher?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300">{course.teacher?.name}</span>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-4">📍 {course.location}</p>

                  {/* Price + Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">₹{course.price}</span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-semibold transition"
                    >
                      Dekho →
                    </Link>
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