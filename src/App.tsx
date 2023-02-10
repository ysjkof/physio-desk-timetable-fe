import { Suspense, lazy } from 'react';
import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { getApolloClient } from './apollo';
import { GlobalLayout } from './components';
import { setAuthToken, setClient, useStore } from './store';

const Loading = lazy(() => import('./components/Loading'));

function App() {
  setAuthToken();
  const token = useStore((state) => state.authToken);
  const client = getApolloClient(token);
  setClient(client);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <Suspense fallback={<Loading />}>
          <GlobalLayout />
        </Suspense>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
