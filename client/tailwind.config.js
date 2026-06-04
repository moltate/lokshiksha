/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        primary: { DEFAULT: '#0056D2', dark: '#003EA6', light: '#EEF4FF' },
        accent: '#F5A623',
        success: '#00B37E',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.07), 0 16px 48px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}