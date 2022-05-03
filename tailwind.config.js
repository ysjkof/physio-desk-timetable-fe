module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        cst: "0 1.5px 4px 1px rgb(0 0 0 / 0.2)",
        b: "0px 10px 10px -9px rgba(0,0,0,0.4)",
      },
      gridTemplateColumns: {
        cal_week: "2.5rem, repeat(7, minmax(0, 1fr))",
        cal_day: "2.5rem, 1fr",
      },
    },
  },
  plugins: [],
};
