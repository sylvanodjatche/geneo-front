// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
        body:    ['Inter', 'sans-serif'],
      },
      colors: {
        void:    '#05070f',
        deep:    '#090d1a',
        surface: '#0e1426',
        accent:  {
          purple: '#7c3aed',
          violet: '#a855f7',
          teal:   '#06b6d4',
          green:  '#10b981',
          amber:  '#f59e0b',
        },
      },
      animation: {
        'spin-slow':   'spin 8s linear infinite',
        'float':       'float 3s ease-in-out infinite',
        'shimmer':     'shimmer 4s linear infinite',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
        'fade-up':     'fadeUp 0.5s ease forwards',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
