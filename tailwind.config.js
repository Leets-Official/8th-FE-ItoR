/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: 'var(--white)',
        black: 'var(--black)',
        gray: {
          7: 'var(--gray-7)',
          20: 'var(--gray-20)',
          33: 'var(--gray-33)',
          56: 'var(--gray-56)',
          78: 'var(--gray-78)',
          90: 'var(--gray-90)',
          96: 'var(--gray-96)',
        },
        positive: 'var(--color-positive)',
        negative: 'var(--color-negative)',
        point: 'var(--color-point)',
        primary: {
          6: 'var(--color-primary-6)',
        },
        neutral: {
          1: 'var(--color-neutral-1)',
          3: 'var(--color-neutral-3)',
          5: 'var(--color-neutral-5)',
        },
      },
      screens: {
        mobile: { max: '390px' },
      },
      fontFamily: {
        noto_sans: ['var(--font-noto-sans)'],
        roboto: ['var(--font-roboto)'],
      },
    },
  },
  plugins: [],
};
