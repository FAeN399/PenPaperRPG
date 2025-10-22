/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pf-primary': '#6d28d9',      // Deep purple
        'pf-secondary': '#8b5cf6',    // Medium purple
        'pf-accent': '#a78bfa',       // Light purple/lavender
        'pf-accent-light': '#c4b5fd', // Very light purple
        'pf-bg': '#0f0a1f',           // Very dark purple-black
        'pf-bg-dark': '#1a0f2e',      // Dark purple
        'pf-bg-card': '#2d1b4e',      // Medium dark purple
        'pf-text': '#f3f4f6',         // Light gray (almost white)
        'pf-text-muted': '#9ca3af',   // Gray for muted text
        'pf-border': '#4c1d95',       // Purple border
        'pf-hover': '#7c3aed',        // Bright purple for hovers
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.5)',
      },
    },
  },
  plugins: [],
}
