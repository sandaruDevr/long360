/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-medium': 'float-medium 4s ease-in-out infinite',
        'float-fast': 'float-fast 3s ease-in-out infinite',
        'float-slow-reverse': 'float-slow-reverse 5s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(2deg)',
          },
        },
        'float-medium': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-15px) rotate(-1deg)',
          },
        },
        'float-fast': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(-10px)',
          },
        },
        'float-slow-reverse': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(15px) rotate(-2deg)',
          },
        },
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};