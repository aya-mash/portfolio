/******************** Tailwind Config ********************/
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono]
      },
      colors: {
        neon: {
          pink: '#ff3df0',
          blue: '#4adfff',
          purple: '#7d5bff',
          green: '#3dffa8'
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.09)',
          active: 'rgba(255,255,255,0.16)'
        }
      },
      backgroundImage: {
        'grid-radial': 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0, transparent 60%)'
      },
      boxShadow: {
        glow: '0 0 8px 2px rgba(255,255,255,0.12)',
        'inner-glow': 'inset 0 0 12px -2px rgba(255,255,255,0.2)'
      },
      animation: {
        'pulse-slow': 'pulse 5s linear infinite'
      }
    }
  },
  plugins: []
};
