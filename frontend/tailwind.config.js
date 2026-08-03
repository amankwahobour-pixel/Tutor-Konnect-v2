/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your template files
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C366D',
          950: '#0C2340',
        },
        secondary: {
          50: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        success: {
          50: '#F0FDF4',
          500: '#22C55E',
          700: '#15803D',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#991B1B',
        },
        warning: {
          50: '#FFFBEB',
          500: '#FBBF24',
          700: '#92400E',
        },
        slate: {
          50: '#F7F9FC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
