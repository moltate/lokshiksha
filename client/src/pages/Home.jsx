import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const categories = [
  { name: 'Computer', icon: '💻', desc: 'MS Office, Coding, Internet' },
  { name: 'Tailoring', icon: '🧵', desc: 'Dress design, Stitching' },
  { name: 'Language', icon: '🗣️', desc: 'English, Hindi, Urdu' },
  { name: 'Coaching', icon: '📚', desc: '10th, 12th, Competitive' },
  { name: 'Skills', icon: '🔧', desc: 'Mehendi, Cooking, Art' },
  { name: 'Other', icon: '🎯', desc: 'Aur bahut kuch' },
]

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logout ho gaye!')
    navigate('/')
  }

  return (
    <div className="min-h-screen" style={{background: '#0f172a'}}>
      {/* Navbar */}
      <nav style={{background: '#1e293b'}} className="px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold text-blue-400">LokShiksha</h1>
        <div className="flex gap-4 items-center">
          <Link to="/courses" className="text-gray-400 hover:text-blue-400">Courses</Link>
          {user ? (
            <>
              <span className="text-blue-400 font-semibold">Namaste, {user.name}!</span>
              {user.role === 'teacher' && (
                <Link to="/dashboard" className="text-gray-400 hover:text-blue-400">Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-blue-400">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{background: 'radial-gradient(circle at 50% 50%, #3b82f6, transparent 70%)'}}
        />
        <h2 className="text-5xl font-bold text-white mb-4 relative">
          Apne Sheher Mein <span className="text-blue-400">Sikhao</span>,<br />
          Apne Sheher Mein <span className="text-blue-400">Seekho</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 relative">
          Malegaon aur aas-paas ke teachers se connect karo — Computer, Tailoring, Language aur bahut kuch
        </p>
        <div className="flex gap-4 justify-center relative">
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Courses Dekho
          </Link>
          {!user && (
            <Link
              to="/register"
              style={{background: '#1e293b'}}
              className="text-blue-400 border border-blue-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-900 transition"
            >
              Teacher Bano
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-3 gap-4">
          {[
            { number: '50+', label: 'Teachers' },
            { number: '200+', label: 'Students' },
            { number: '30+', label: 'Courses' },
          ].map(stat => (
            <div key={stat.label} style={{background: '#1e293b'}} className="rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-blue-400">{stat.number}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Kya Seekhna Chahte Ho?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Link
              to={`/courses?category=${cat.name.toLowerCase()}`}
              key={cat.name}
              style={{background: '#1e293b'}}
              className="rounded-2xl p-6 text-center hover:border-blue-500 border border-transparent transition-all hover:-translate-y-1 cursor-pointer"
            >
              <p className="text-4xl mb-2">{cat.icon}</p>
              <p className="font-semibold text-white">{cat.name}</p>
              <p className="text-gray-400 text-sm mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}