import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium transition-colors px-1 py-0.5 border-b-2 ${
        location.pathname === path
          ? 'text-primary border-primary'
          : 'text-slate-600 border-transparent hover:text-primary'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LS</span>
            </div>
            <span className="font-bold text-lg text-slate-900">
              Lok<span className="text-primary">Shiksha</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLink('/courses', 'Explore Courses')}
            {user?.role === 'teacher' && navLink('/dashboard', 'Dashboard')}
            {user?.role === 'admin' && navLink('/admin', 'Admin Panel')}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <span className="text-xs text-slate-400 capitalize bg-slate-200 px-1.5 py-0.5 rounded-full">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
               <Link to="/login" className="text-sm font-semibold text-slate-700 border border-slate-300 hover:border-primary hover:text-primary transition-colors px-4 py-2 rounded-lg">
  Log In
</Link>
                <Link to="/register" className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-3">
            <Link to="/courses" className="text-sm font-medium text-slate-700 py-1">Explore Courses</Link>
            {user?.role === 'teacher' && <Link to="/dashboard" className="text-sm font-medium text-slate-700 py-1">Dashboard</Link>}
            {!user ? (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 text-center text-sm font-semibold border border-slate-300 py-2 rounded-lg">Log In</Link>
                <Link to="/register" className="flex-1 text-center text-sm font-semibold bg-primary text-white py-2 rounded-lg">Join Free</Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="text-sm font-medium text-red-500 py-1 text-left">Logout</button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}