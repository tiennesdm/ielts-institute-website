/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ielts: {
          blue: '#0B2545',
          navy: '#13315C',
          accent: '#E63946',
          gold: '#FFB703',
          teal: '#134E4A',
          light: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#0F172A',
        }
      }
    },
  },
  plugins: [],
}
