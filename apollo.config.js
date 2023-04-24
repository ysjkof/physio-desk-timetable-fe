module.exports = {
  client: {
    includes: ['./src/**/*.tsx'],
    tagName: 'gql',
    service: {
      name: 'physio-desk-backend',
      url: 'http://localhost:3002/graphql',
    },
  },
};
