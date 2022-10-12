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
import localStorageUtils from './utils/localStorageUtils';
import { printNetworkError } from './utils/errorUtils';

const token = localStorageUtils.get<string>({ key: 'token' });
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar<string | null>(token);

const FLYIO = '://muool-backend.fly.dev/graphql';
const ORACLE_CLOUD = '://db.muool.com:8443/graphql';
const LOCAL = '://localhost:3002/graphql';

const BACKEND_URLS = {
  FLYIO,
  ORACLE_CLOUD,
  LOCAL,
};

const PRODUCTION_URL = process.env.BACKEND === 'FLYIO' ? FLYIO : ORACLE_CLOUD;
const DEV_URL = BACKEND_URLS.LOCAL;

const isProduction = process.env.NODE_ENV === 'production';

const wsLink = new GraphQLWsLink(
  createClient({
    url: isProduction ? `wss${PRODUCTION_URL}` : `ws${DEV_URL}`,
    connectionParams: () => {
      return { 'x-jwt': authTokenVar() };
    },
  })
);

const httpLink = createHttpLink({
  uri: isProduction ? `https${PRODUCTION_URL}` : `http${DEV_URL}`,
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
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) {
    printNetworkError(networkError.message);
    console.warn(`[Network error]: ${networkError}`);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
