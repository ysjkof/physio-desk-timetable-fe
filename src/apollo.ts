import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import localStorageUtils from './utils/localStorage.utils';
import { printGraphQLErrors, printNetworkError } from './utils/error.utils';

const token = localStorageUtils.get<string>({ key: 'token' });
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar<string | null>(token);

const isDevelopment = import.meta.env.MODE === 'development';

const BACKEND_URL = isDevelopment
  ? '://localhost:3002/graphql'
  : import.meta.env.VITE_BACKEND_URL;

const wsLink = new GraphQLWsLink(
  createClient({
    url: isDevelopment ? `ws${BACKEND_URL}` : `wss${BACKEND_URL}`,
    connectionParams: () => {
      return { 'x-jwt': authTokenVar() };
    },
  })
);

const httpLink = createHttpLink({
  uri: isDevelopment ? `http${BACKEND_URL}` : `https${BACKEND_URL}`,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // 로그인 안했을때도 이 리퀘스트는 계속 요청되니 || "" 추가.
      'x-jwt': authTokenVar(),
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
      const { locations, message, path } = errors;

      if (message.includes('"$input" got invalid value'))
        printGraphQLErrors('gotInvalidValue');

      console.error(
        `[GraphQL error]:
        Message: ${message};
        Location: ${JSON.stringify(locations)};
        Path: ${JSON.stringify(path)};`
      );
    });

  if (networkError) {
    printNetworkError();
    // const { message, name, cause, stack } = networkError;
    // console.error(
    //   `[Network error]:
    //   Message: ${message};
    //   Name: ${name};
    //   Cause: ${cause};
    //   Stack: ${stack};`
    // );
  }
});

export const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});
