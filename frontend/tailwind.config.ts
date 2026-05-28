import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FDFBF7',
          secondary: '#F3EFE6',
          tertiary: '#EBE4D5',
        },
        ink: {
          DEFAULT: '#2A1D1A',
          soft: '#5C4A45',
        },
        brand: {
          DEFAULT: '#6A1A2A',
          hover: '#50121F',
          deep: '#3F0B17',
        },
        gold: {
          DEFAULT: '#C5A059',
          muted: '#E5D4B3',
          dark: '#9A7C3F',
        },
        line: '#D8CDBF',
      },
      fontFamily: {
        heading: ['var(--font-bodoni)', 'Bodoni Moda', 'serif'],
        sub: ['var(--font-marcellus)', 'Marcellus', 'serif'],
        body: ['var(--font-jost)', 'Jost', 'sans-serif'],
        accent: ['var(--font-yatra)', 'Yatra One', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wide2: '0.2em',
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'fade-up': 'fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
