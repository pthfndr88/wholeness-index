import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#5b2d8a', light: '#f3eafd', mid: '#9b59d0', dark: '#3d1e5e' },
        seek:  { DEFAULT: '#1e3a6e', light: '#e8f0fb', mid: '#4a7cc4' },
        pow:   { DEFAULT: '#2d6a35', light: '#e8f5ea', mid: '#4a9e5c' },
        gem:   { DEFAULT: '#7a4500', light: '#fdf0e0', mid: '#c97810' },
        frag:  { DEFAULT: '#7a1f1f', light: '#fdf0f0', mid: '#b04040' },
        aln:   { DEFAULT: '#5b2d8a', light: '#f3eafd', mid: '#9b59d0' },
      },
    },
  },
  plugins: [],
}
export default config
