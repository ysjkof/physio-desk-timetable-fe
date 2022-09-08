import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getStorage } from './utils/localStorageUtils';

const token = getStorage<string>({ key: 'token' });
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar<string | null>(token);

const PRODUCTION_URL = '://muool-backend.fly.dev/graphql';
const DEV_URL = '://localhost:3002/graphql';

const wsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NODE_ENV === 'production'
        ? `wss${PRODUCTION_URL}`
        : `ws${DEV_URL}`,
    connectionParams: () => {
      return { 'x-jwt': authTokenVar() };
    },
  })
);

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? `https${PRODUCTION_URL}`
      : `http${DEV_URL}`,
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

export const client = new ApolloClient({
  link: splitLink,
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
