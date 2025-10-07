/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00BFFF',
        secondary: '#0080FF',
        dark: '#0a192f',
        darker: '#020617',
        unsc: '#00BFFF',
        'unsc-dark': '#003366',
        'neon-pink': '#ff6ec7',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}