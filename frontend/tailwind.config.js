/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '400px',   // Wide mobile (400px - 639px); below 400px = Mini mobile (320px - 399px)
      'sm': '640px',   // Large mobile / Phablet / Small Tablet
      'md': '768px',   // Tablet Portrait
      'lg': '1024px',  // Tablet Landscape / Small Laptop
      'xl': '1280px',  // Standard Laptop
      '2xl': '1536px', // Wide Desktop
    },
    extend: {
      colors: {
        sepia: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#EADFCF',
          300: '#DCCBB2',
          800: '#433422',
          900: '#2C2216',
        },
        reader: {
          bgLight: '#FAF9F6',
          textLight: '#1A1A1A',
          bgSepia: '#F4ECD8',
          textSepia: '#5B4636',
          bgDark: '#1E2022',
          textDark: '#E4E6EB',
          bgOled: '#000000',
          textOled: '#CCCCCC',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
}
