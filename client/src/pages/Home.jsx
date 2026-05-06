import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">LokShiksha</h1>
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Apne Sheher Mein Sikhao, Apne Sheher Mein Seekho
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          Malegaon aur aas-paas ke teachers se connect karo — Computer, Tailoring, Language aur bahut kuch
        </p>
        <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
          Shuru Karo
        </Link>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <h3 className="text-2xl font-bold text-center text-gray-700 mb-8">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Computer', 'Tailoring', 'Language', 'Coaching', 'Skills', 'Other'].map(cat => (
            <div key={cat} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md cursor-pointer">
              <p className="font-semibold text-gray-700">{cat}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}