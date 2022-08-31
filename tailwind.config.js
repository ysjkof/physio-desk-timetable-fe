module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        cst: '0 1.5px 4px 1px rgb(0 0 0 / 0.2)',
        b: '0px 10px 10px -9px rgba(0,0,0,0.4)',
        rt: '14px 0px 21px -10px',
      },
      keyframes: {
        fadeout: {
          '0%, 40%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: { fadeout: 'fadeout 3s linear 1' },
      backgroundImage: {
        check: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='4' stroke='white' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5' /%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
