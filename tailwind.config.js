/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {},
    keyframes: {
      'scale-shadow': {
        '0%': { transform: 'translate(-50%, -50%) scale(1)' },
        '100%': { transform: 'translate(-50%, -50%) scale(1.5)' }
      }
    },
    animation: {
      'scale-shadow': 'scale-shadow 1.5s ease-in-out infinite'
    }
  },
  plugins: []
}
