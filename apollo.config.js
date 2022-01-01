module.exports = {
  client: {
    includes: ["./src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "muool-backend",
      url: "http://localhost:3002/graphql",
    },
  },
};
