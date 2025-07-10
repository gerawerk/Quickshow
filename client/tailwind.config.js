//// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F84565',
        'primary-dull': '#D63854',
      },
    },
  },
  plugins: [],
}

