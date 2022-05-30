module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        cst: "0 1.5px 4px 1px rgb(0 0 0 / 0.2)",
        b: "0px 10px 10px -9px rgba(0,0,0,0.4)",
      },
      gridTemplateColumns: {
        header: "repeat(7, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
