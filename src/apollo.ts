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
import { printGraphQLErrors, printNetworkError } from './utils/error.utils';

export const getApolloClient = (token: string | null) => {
  const isDevelopment = import.meta.env.MODE === 'development';

  const BACKEND_URL = isDevelopment
    ? '://localhost:3002/graphql'
    : import.meta.env.VITE_BACKEND_URL;

  const wsLink = new GraphQLWsLink(
    createClient({
      url: isDevelopment ? `ws${BACKEND_URL}` : `wss${BACKEND_URL}`,
      connectionParams: () => {
        return { 'x-jwt': token };
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
        'x-jwt': token,
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

  return new ApolloClient({
    link: from([errorLink, splitLink]),
    cache: new InMemoryCache(),
  });
};
