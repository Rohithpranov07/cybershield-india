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
        primary: '#3498db',
        danger: '#e74c3c',
        success: '#27ae60',
        warning: '#f39c12',
        dark: '#2c3e50',
      },
    },
  },
  plugins: [],
};
