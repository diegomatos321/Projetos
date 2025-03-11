/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./public/**/*.php",  // Scan PHP files for Tailwind classes
      "./src/css/**/*.css"  // Include your separate CSS files
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  