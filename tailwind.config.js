/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        neon: '#00F0FF',
        'neon-dim': '#0099AA',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'aurora-shift': 'aurora-shift 8s ease infinite',
        'float-y': 'float-y 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse': 'spin-reverse 18s linear infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        glitch: 'glitch 0.3s ease infinite',
        orbit: 'orbit 8s linear infinite',
        'orbit-reverse': 'orbit-reverse 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'aurora-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 8px #00F0FF44' },
          '50%': { boxShadow: '0 0 24px #00F0FF99' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
          '100%': { transform: 'translate(0)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(var(--radius)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(var(--radius)) rotate(-360deg)' },
        },
        'orbit-reverse': {
          '0%': { transform: 'rotate(360deg) translateX(var(--radius)) rotate(-360deg)' },
          '100%': { transform: 'rotate(0deg) translateX(var(--radius)) rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}
