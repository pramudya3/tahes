/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        strava: {
          orange: '#FC4C02',
          hover: '#E34402',
          light: '#FFF0EB',
          dark: '#0F172A',
          card: '#1E293B',
          cardSoft: '#334155',
        }
      }
    },
  },
  plugins: [],
}
