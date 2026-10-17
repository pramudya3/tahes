/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rally: {
          orange: '#FF3B00',
          orangeDeep: '#D63200',
          amber: '#F59E0B',
          emerald: '#10B981',
          asphalt: '#0B0F19',
          slate: '#111827',
          slateSoft: '#1A2436',
          border: '#24334A',
          textMuted: '#8292A8',
        },
        strava: {
          orange: '#FF3B00',
          hover: '#D63200',
          light: '#FFF0EB',
          dark: '#0B0F19',
          card: '#111827',
          cardSoft: '#1A2436',
        }
      }
    },
  },
  plugins: [],
}
