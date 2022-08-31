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
    },
  },
  plugins: [],
};
