import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">LokShiksha</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <span className="text-gray-600">Namaste, {user.name}!</span>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Saare Courses</h2>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Course dhundo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <p className="text-center text-gray-500 py-20">Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Koi course nahi mila</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                {/* Category Badge */}
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {course.category}
                </span>

                <h3 className="font-bold text-gray-800 text-lg mt-3 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>

                {/* Teacher */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {course.teacher?.name?.[0]}
                  </div>
                  <span className="text-sm text-gray-600">{course.teacher?.name}</span>
                </div>

                {/* Location */}
                <p className="text-sm text-gray-400 mb-4">📍 {course.location}</p>

                {/* Price + Button */}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">₹{course.price}</span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Dekhो
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}