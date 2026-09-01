/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16251c',
        moss: '#416353',
        paper: '#f6f5ef',
        mist: '#e5ede5',
        signal: '#bd5a36',
        sunflower: '#eccf66',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

