import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { icon: '💻', label: 'Computer Skills', count: '24 courses', color: 'bg-blue-50 text-blue-700' },
  { icon: '✂️', label: 'Tailoring & Fashion', count: '18 courses', color: 'bg-pink-50 text-pink-700' },
  { icon: '🗣️', label: 'Language Learning', count: '32 courses', color: 'bg-green-50 text-green-700' },
  { icon: '📚', label: 'Academic Coaching', count: '41 courses', color: 'bg-purple-50 text-purple-700' },
  { icon: '🔧', label: 'Vocational Skills', count: '15 courses', color: 'bg-orange-50 text-orange-700' },
  { icon: '🎨', label: 'Creative Arts', count: '9 courses', color: 'bg-rose-50 text-rose-700' },
]

const STATS = [
  { value: '12,000+', label: 'Students Enrolled' },
  { value: '850+', label: 'Local Teachers' },
  { value: '200+', label: 'Courses Available' },
  { value: '45+', label: 'Cities Covered' },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    city: 'Malegaon',
    role: 'Student',
    text: 'LokShiksha ne mujhe apne hi sheher mein computer sikhne ka mauka diya. Ab main freelancing kar rahi hun!',
    avatar: 'P',
    rating: 5,
  },
  {
    name: 'Ramesh Yadav',
    city: 'Bhiwandi',
    role: 'Teacher',
    text: 'Mera coaching center sirf local tha. Ab mere 200+ online students hain poore Maharashtra mein.',
    avatar: 'R',
    rating: 5,
  },
  {
    name: 'Salma Khan',
    city: 'Jalgaon',
    role: 'Student',
    text: 'Tailoring course se mujhe ghar baithe kaam milne laga. Teacher bahut helpful hain.',
    avatar: 'S',
    rating: 5,
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Apna Course Dhundo', desc: 'Category ya location se apne shahar ke best teachers aur courses browse karo.' },
  { step: '02', title: 'Enroll Karo', desc: 'Ek click mein enroll karo aur teacher se directly connect karo.' },
  { step: '03', title: 'Seekho aur Badho', desc: 'Local expertise se skill hasil karo aur apne career ko nai disha do.' },
]

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-accent fill-accent" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001F5C] via-[#0056D2] to-[#0072FF]">
        {/* background dots */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">India's Local Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Apne Sheher Ke{' '}
              <span className="font-serif italic text-accent">Best Teachers</span>{' '}
              Se Seekho
            </h1>

            <p className="text-lg text-blue-100 mb-8 max-w-xl leading-relaxed">
              Tier-2 aur Tier-3 cities ke talented local teachers se connect karo. Affordable, local, aur practical skills — sirf tumhare liye.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-black/20 text-base"
              >
                Courses Explore Karo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all text-base"
                >
                  Teacher Bano
                </Link>
              )}
            </div>

            {/* Mini trust badges */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-400 flex items-center justify-center text-white text-xs font-bold">{l}</div>
                ))}
              </div>
              <div>
                <StarRating count={5} />
                <p className="text-blue-200 text-xs mt-0.5">12,000+ students already learning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 50 720 70 0 0L0 60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-sm text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Apni <span className="text-primary">Skill</span> Chuno
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Har field mein local experts available hain — sirf apna interest select karo</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to={`/courses?category=${cat.label.toLowerCase().replace(/ /g, '-')}`}
                className="group flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-card-hover transition-all duration-200"
              >
                <span className="text-3xl mb-3">{cat.icon}</span>
                <span className="text-sm font-semibold text-slate-700 text-center group-hover:text-primary transition-colors">{cat.label}</span>
                <span className="text-xs text-slate-400 mt-1">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Kaise Kaam Karta Hai?</h2>
            <p className="text-slate-500">3 simple steps mein apni learning journey shuru karo</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-primary/30">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Log Kya Kehte Hain?
            </h2>
            <p className="text-slate-400">Real students, real teachers, real results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <StarRating count={t.rating} />
                <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Aaj Hi Shuru Karo —{' '}
            <span className="font-serif italic text-primary">Bilkul Free</span>
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Register karo, apna course dhundo, aur apne sheher ke best teacher se seekhna start karo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 text-base">
              Student ke Taur Par Join Karo
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold px-8 py-4 rounded-xl hover:bg-primary hover:text-white transition-all text-base">
              Teacher Bano
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">LS</span>
              </div>
              <span className="font-bold text-white">LokShiksha</span>
            </div>
            <p className="text-sm text-center">Apne Sheher Mein Sikhao, Apne Sheher Mein Seekho · Made with ❤️ for Bharat</p>
            <div className="flex gap-4 text-sm">
              <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}