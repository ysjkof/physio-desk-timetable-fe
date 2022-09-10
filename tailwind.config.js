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
        // heroicons.com -> user
        person: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white' class='w-5 h-5'%3E%3Cpath d='M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z' /%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
