import { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { client } from './apollo';
import { GlobalLayout, SignInLayout, SignOutLayout } from './components';
import { setAuthToken, useStore } from './store';

function App() {
  const isLoggedIn = useStore((state) => state.isLoggedIn); // 새로고침 시 리렌더 위한 사용

  useEffect(() => {
    if (isLoggedIn) return;
    setAuthToken(); // 새로고침을 하면 token을 set 한 곳이 없기 때문에 필요
  }, []);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <GlobalLayout>
          {isLoggedIn ? <SignInLayout /> : <SignOutLayout />}
        </GlobalLayout>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
