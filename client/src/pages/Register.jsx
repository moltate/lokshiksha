import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'student', label: 'Student', icon: '🎓', desc: 'Naye skills seekhna chahta hun' },
  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫', desc: 'Apna knowledge share karna chahta hun' },
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password kam se kam 6 characters ka hona chahiye')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      toast.success('Account ban gaya! Welcome to LokShiksha 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#001F5C] via-[#0056D2] to-[#0072FF] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">LS</span>
          </div>
          <span className="text-white font-bold text-xl">LokShiksha</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            India Ki Local<br />Learning Revolution
          </h2>
          <p className="text-blue-200 text-lg mb-8">Tier-2 aur Tier-3 cities ke liye banaya gaya — sirf tumhare liye.</p>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {['A','B','C','D'].map((l,i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-blue-400 border-2 border-blue-600 flex items-center justify-center text-white text-xs font-bold">{l}</div>
                ))}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_,i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-blue-100 text-sm italic">"LokShiksha ne meri life change kar di. Local teacher se seekhna bilkul alag experience hai!"</p>
            <p className="text-blue-300 text-xs mt-2">— Priya, Malegaon</p>
          </div>
        </div>
        <p className="text-blue-300 text-sm relative z-10">© 2026 LokShiksha. Made for Bharat 🇮🇳</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LS</span>
            </div>
            <span className="font-bold text-lg">Lok<span className="text-primary">Shiksha</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Banao</h1>
            <p className="text-slate-500">Bilkul free — sirf 1 minute lagega</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Main hoon...</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.role === r.value
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{r.icon}</span>
                    <span className={`font-bold text-sm block ${form.role === r.value ? 'text-primary' : 'text-slate-700'}`}>{r.label}</span>
                    <span className="text-xs text-slate-400 leading-tight block mt-0.5">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tumhara naam"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tumhari@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </>
              ) : 'Free Mein Join Karo 🚀'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              Register karke tum hamare Terms of Service se agree karte ho.
            </p>
          </form>

          <div className="mt-5 text-center">
            <p className="text-slate-500 text-sm">
              Pehle se account hai?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Login karo</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}