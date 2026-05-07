import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData)
      login(res.data.user, res.data.token)
      toast.success('Login ho gaye!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kuch galat hua')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background: '#0f172a'}}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">LokShiksha</h1>
          <p className="text-gray-400 mt-2">Apne sheher ki shiksha</p>
        </div>

        <div style={{background: '#1e293b'}} className="rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Login Karo</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{background: '#0f172a', borderColor: '#334155'}}
                className="w-full border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="apna@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{background: '#0f172a', borderColor: '#334155'}}
                className="w-full border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 transition mt-2"
            >
              {loading ? 'Loading...' : 'Login Karo'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Account nahi hai?{' '}
            <Link to="/register" className="text-blue-400 font-semibold hover:underline">
              Register karo
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}