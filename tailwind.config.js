module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        cst: "0 1.5px 4px 1px rgb(0 0 0 / 0.2)",
        b: "0px 10px 10px -9px rgba(0,0,0,0.4)",
      },
      gridTemplateColumns: {
        // cal_day: "2.5rem, 1fr",
        header: "2.5rem, repeat(7, minmax(0, 1fr))",
        week: "2.5rem, repeat(7, 24rem)",
        week_col: "2.5rem, repeat(7, 24rem)",
        day: "2.5rem, 1fr",
        week_user1: "2.5rem repeat(1, minmax(0,1fr)",
        week_user2: "2.5rem repeat(2,minmax(0,1fr)",
        week_user3: "2.5rem repeat(7, 18rem)",
        week_user4: "2.5rem repeat(7, 24rem)",
        // user5:
        // user6:
        // user7:
        // user8:
        // user9:
        // user10:
      },
    },
  },
  plugins: [],
};
