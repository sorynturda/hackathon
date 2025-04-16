/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'black': '#181818',
        'white': '#f0f0f0',
        'accent': '#EC6B2D',
        'green': '#4caf50',
        'red': '#f44336',
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
        'helvetica-neue': ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}