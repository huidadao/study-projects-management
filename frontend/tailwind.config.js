/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#181d26',
        'airtable-blue': '#1b61c9',
      },
    },
  },
  plugins: [],
}