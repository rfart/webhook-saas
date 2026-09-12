import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        highlight: {
          '0%': { backgroundColor: 'rgba(99,102,241,0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        highlight: 'highlight 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
