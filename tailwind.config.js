/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0a0a0a',
        'dark-black': '#1a1a1a',
        'royal-purple': '#6b46c1',
        'electric-blue': '#3182ce',
        'premium-gold': '#d4af37',
        'platinum': '#e2e8f0',
        'crystal': 'rgba(255, 255, 255, 0.1)',
        'success': '#48bb78',
        'error': '#f56565',
        'warning': '#ed8936',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
    }
