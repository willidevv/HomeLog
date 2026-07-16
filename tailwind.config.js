/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1F2A44',
          800: '#2A3858',
          700: '#3A4A6F',
          600: '#4B5D85',
        },
        cream: {
          50: '#F7F3EA',
          100: '#F0EDE0',
          200: '#E8DCC8',
          300: '#E0D1B5',
          400: '#D8C6A2',
        },
        gold: {
          50: '#FFF8E6',
          100: '#FDF5D8',
          200: '#F9EFCA',
          300: '#F3E5B4',
          400: '#EADB9E',
          500: '#C6A75E',
          600: '#B39653',
          700: '#A08548',
        },
      },
      backgroundImage: {
        'gradient-navy-cream': 'linear-gradient(135deg, #1F2A44 0%, #E8DCC8 100%)',
        'gradient-navy-gold': 'linear-gradient(135deg, #1F2A44 0%, #C6A75E 100%)',
        'gradient-cream-navy': 'linear-gradient(135deg, #E8DCC8 0%, #1F2A44 100%)',
        'gradient-gold-navy': 'linear-gradient(135deg, #C6A75E 0%, #1F2A44 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(232,220,200,0) 0%, rgba(198,167,94,0.1) 100%)',
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(31, 42, 68, 0.08), 0 2px 8px rgba(31, 42, 68, 0.04)',
        'premium-lg': '0 10px 40px rgba(31, 42, 68, 0.12), 0 6px 20px rgba(31, 42, 68, 0.06)',
        'premium-gold': '0 0 20px rgba(198, 167, 94, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-gold': 'pulseGold 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198, 167, 94, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(198, 167, 94, 0)' },
        },
      },
    },
  },
  plugins: [],
}

