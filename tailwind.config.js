/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          bg: '#09090B',
          card: '#121214',
          cardSoft: '#18181B',
          border: '#27272A',
          white: '#FFFFFF',
          silver: '#E4E4E7',
          muted: '#A1A1AA',
          crimson: '#FF2E54',
          crimsonDeep: '#DC2626',
        },
        rally: {
          orange: '#FFFFFF',
          orangeDeep: '#E4E4E7',
          amber: '#F59E0B',
          emerald: '#10B981',
          asphalt: '#09090B',
          slate: '#121214',
          slateSoft: '#18181B',
          border: '#27272A',
          textMuted: '#A1A1AA',
        },
        strava: {
          orange: '#FFFFFF',
          hover: '#E4E4E7',
          light: '#27272A',
          dark: '#09090B',
          card: '#121214',
          cardSoft: '#18181B',
        }
      }
    },
  },
  plugins: [],
}
