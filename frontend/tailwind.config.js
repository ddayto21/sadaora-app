/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ enable scanning TS/JSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};