/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pf-primary': '#5e0000',
        'pf-secondary': '#8b0000',
        'pf-accent': '#daa520',
        'pf-bg-dark': '#1a1a1a',
        'pf-bg-card': '#2d2d2d',
        'pf-text': '#e0e0e0',
        'pf-text-muted': '#a0a0a0',
      },
    },
  },
  plugins: [],
}
