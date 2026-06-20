/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          blue:      '#2563EB',
          blueDark:  '#1D4ED8',
          blueLight: '#3B82F6',
          dark:      '#060B16',
          darker:    '#030711',
          card:      '#0F1629',
          cardLight: '#151C34',
          border:    '#1E2A47',
          text:      '#94A3B8',
          muted:     '#64748B',
          gold:      '#F59E0B',
          green:     '#10B981',
          red:       '#EF4444',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'ping-slow':  'ping 2s cubic-bezier(0,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
}
