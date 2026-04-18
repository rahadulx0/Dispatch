import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#121212',
          50: '#f7f7f7',
          100: '#ececec',
          200: '#d8d8d8',
          300: '#b4b4b4',
          400: '#7c7c7c',
          500: '#4a4a4a',
          600: '#2a2a2a',
          700: '#1a1a1a',
          800: '#121212',
          900: '#000000',
        },
        brand: {
          DEFAULT: '#FA6400',
          50: '#FFF3EB',
          100: '#FFDDC2',
          300: '#FFA15C',
          500: '#FA6400',
          600: '#D95500',
          700: '#B74700',
        },
        rule: '#e5e5e5',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        'headline': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      maxWidth: {
        content: '1280px',
        article: '820px',
        'article-hero': '960px',
      },
    },
  },
  plugins: [],
};

export default config;
