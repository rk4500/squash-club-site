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
        gold: {
          DEFAULT: '#f5a800',
          bright: '#ffbe33',
          dim: 'rgba(245,168,0,0.15)',
        },
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        condensed: ['var(--font-condensed)', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5a800, #ffd166, #f5a800)',
      },
    },
  },
  plugins: [],
}
