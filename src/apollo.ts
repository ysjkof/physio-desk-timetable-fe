import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { printGraphQLErrors, printNetworkError } from './utils/errorUtils';
import { localStorageUtils } from './utils/localStorageUtils';
import { BACKEND_ORIGIN } from './router/routes';

const BACKEND_URL = `${BACKEND_ORIGIN}/graphql`;

const BACKEND_WS_URL = BACKEND_URL.replace('http', 'ws');

const wsLink = new GraphQLWsLink(
  createClient({
    url: BACKEND_WS_URL,
    connectionParams: () => {
      return { 'x-jwt': localStorageUtils.get({ key: 'token' }) };
    },
  })
);

const httpLink = createHttpLink({ uri: BACKEND_URL });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // token을 변수로 할당에 split과 여기서 사용하면 헤더에 x-jwt가 없다.
      'x-jwt': localStorageUtils.get({ key: 'token' }),
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    return graphQLErrors.forEach((errors) => {
      const { locations, message, path, extensions } = errors;

      if (message.includes('"$input" got invalid value'))
        printGraphQLErrors('gotInvalidValue');

      console.error(
        `[GraphQL error]:
        Message: ${message};
        Location: ${JSON.stringify(locations)};
        Path: ${JSON.stringify(path)};
        Extensions :${JSON.stringify(extensions)};`
      );
    });

  if (networkError) {
    printNetworkError();
    const { message, name, cause, stack } = networkError;
    console.error(
      `[Network error]:
      Message: ${message};
      Name: ${name};
      Cause: ${cause};
      Stack: ${stack};`
    );
  }
});

const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});

export { client };
