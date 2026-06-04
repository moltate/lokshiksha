import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const CATEGORIES = [
  { value: '', label: 'All Courses' },
  { value: 'computer', label: '💻 Computer' },
  { value: 'tailoring', label: '✂️ Tailoring' },
  { value: 'language', label: '🗣️ Language' },
  { value: 'coaching', label: '📚 Coaching' },
  { value: 'skills', label: '🔧 Skills' },
  { value: 'other', label: '🎨 Other' },
]

function CourseCard({ course }) {
  const stars = course.rating?.average || 0
  const count = course.rating?.count || 0

  return (
    <Link to={`/courses/${course._id}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-60">
              {course.category === 'computer' ? '💻' : course.category === 'tailoring' ? '✂️' : course.category === 'language' ? '🗣️' : course.category === 'coaching' ? '📚' : '🔧'}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{course.category}</span>
        </div>
        {course.price === 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
        <p className="text-slate-500 text-xs mb-3 line-clamp-2 leading-relaxed">{course.description}</p>

        {/* Teacher */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
            {course.teacher?.name?.[0]?.toUpperCase() || 'T'}
          </div>
          <span className="text-xs text-slate-500 truncate">{course.teacher?.name || 'Teacher'}</span>
        </div>

        {/* Rating */}
        {count > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-bold text-amber-500">{stars.toFixed(1)}</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-3 h-3 ${s <= Math.round(stars) ? 'fill-amber-400' : 'fill-slate-200'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-slate-400">({count})</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {course.price === 0 ? (
              <span className="text-green-600 font-bold text-base">Free</span>
            ) : (
              <span className="text-slate-900 font-bold text-base">₹{course.price}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            {course.location}
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="skeleton h-44" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-3 w-1/2 mt-4" />
      </div>
    </div>
  )
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      const res = await axios.get('http://localhost:5000/api/courses', { params })
      setCourses(res.data)
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [search, category])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#001F5C] to-[#0056D2] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Courses</h1>
          <p className="text-blue-200 mb-6">Apne sheher ke best teachers se seekho</p>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Course ya skill search karo..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
            </div>
            <button type="submit" className="bg-accent text-white font-bold px-5 py-3 rounded-xl hover:bg-amber-500 transition-colors text-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                category === cat.value
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-slate-500 text-sm mb-6">
            <span className="font-bold text-slate-800">{courses.length}</span> courses found
            {search && <span> for "<span className="text-primary font-medium">{search}</span>"</span>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Koi course nahi mila</h3>
            <p className="text-slate-500 mb-4">Search ya filter change karke dekho</p>
            <button onClick={() => { setSearch(''); setSearchInput(''); setCategory('') }}
              className="text-primary font-semibold hover:underline">
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </div>
    </div>
  )
}