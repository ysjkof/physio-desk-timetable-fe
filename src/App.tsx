import { Suspense } from 'react';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { client, isLoggedInVar } from './apollo';
import GlobalLayout from './_legacy_components/templates/GlobalLayout';
import Loading from './_legacy_components/atoms/Loading';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <Suspense fallback={<Loading />}>
          <GlobalLayout isLoggedIn={isLoggedIn} />
        </Suspense>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
