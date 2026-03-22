/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        albion: {
          gold: '#f5c842',
          dark: '#0d0f14',
          panel: '#161921',
          border: '#2a2f3e',
          hover: '#1e2330',
          blue: '#4a9eff',
          green: '#4ade80',
          red: '#f87171',
          yellow: '#facc15',
          orange: '#fb923c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
