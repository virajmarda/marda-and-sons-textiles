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
        maroon: {
          DEFAULT: '#6F1D1B',
          light: '#8B2322',
          dark: '#4A1210',
        },
Add tailwind.config.ts          DEFAULT: '#F4A300',
          light: '#F7BC40',
          dark: '#C68200',
        },
        indigo: {
          DEFAULT: '#1A2740',
          light: '#243654',
          dark: '#111B2B',
        },
        cream: '#F5F1E8',
        sand: '#D8C7A6',
        muted: '#B0B0B0',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'texture': "url('/texture.png')",
      },
    },
  },
  plugins: [],
};

export default config;
