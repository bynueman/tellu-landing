/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tellu: {
          dark: '#07090E',
          cardDark: '#0E131F',
          surfaceDark: '#141C2E',
          borderDark: 'rgba(255, 255, 255, 0.08)',
          light: '#F8FAFC',
          cardLight: '#FFFFFF',
          surfaceLight: '#F1F5F9',
          borderLight: 'rgba(15, 23, 42, 0.08)',
        },
        pillar: {
          tech: {
            DEFAULT: '#FF9700',
            glow: 'rgba(255, 151, 0, 0.35)',
            subtle: 'rgba(255, 151, 0, 0.12)',
            border: 'rgba(255, 151, 0, 0.25)',
            light: '#FFAE33',
            dark: '#D97F00',
          },
          growth: {
            DEFAULT: '#C8ED00',
            glow: 'rgba(200, 237, 0, 0.35)',
            subtle: 'rgba(200, 237, 0, 0.12)',
            border: 'rgba(200, 237, 0, 0.25)',
            light: '#D7F233',
            dark: '#A4C400',
          },
          partner: {
            cyan: '#38B5EF',
            violet: '#5C18DA',
            glow: 'rgba(56, 181, 239, 0.35)',
            subtle: 'rgba(56, 181, 239, 0.12)',
            border: 'rgba(56, 181, 239, 0.25)',
          }
        }
      },
      fontFamily: {
        sans: ['"Satoshi"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        display: ['"Cabinet Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-very-slow': 'spin 30s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 25px rgba(255, 151, 0, 0.35)) drop-shadow(0 0 45px rgba(56, 181, 239, 0.25))' },
          '50%': { filter: 'drop-shadow(0 0 35px rgba(200, 237, 0, 0.4)) drop-shadow(0 0 60px rgba(92, 24, 218, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(255, 151, 0, 0.45)) drop-shadow(0 0 50px rgba(56, 181, 239, 0.35))' },
        }
      }
    },
  },
  plugins: [],
}
