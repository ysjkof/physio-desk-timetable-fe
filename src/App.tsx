import { Suspense, lazy } from 'react';
import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { getApolloClient } from './apollo';
import { GlobalLayout } from './components';
import { setAuthToken, setClient, useStore } from './store';
import { localStorageUtils } from './utils/localStorage.utils';

const Loading = lazy(() => import('./components/Loading'));

function App() {
  useStore((state) => state.isLoggedIn); // 새로고침 시 리렌더 위한 사용
  setAuthToken();
  const client = getApolloClient(localStorageUtils.get({ key: 'token' }));
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
