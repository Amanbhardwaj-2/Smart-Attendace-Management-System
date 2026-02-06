/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding your "Premium" colors here so you can use them as classes
        'midnight': '#05070a',
        'surface': '#0f172a',
        'electric-violet': '#8b5cf6',
      }
    },
  },
  plugins: [],
}