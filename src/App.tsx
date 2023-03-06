import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { client } from './apollo';
import { GlobalLayout } from './components';
import { setAuthToken, useStore } from './store';

function App() {
  useStore((state) => state.isLoggedIn); // 새로고침 시 리렌더 위한 사용
  setAuthToken(); // 새로고침을 하면 token set을 한 곳이 없기 때문에 필요

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <GlobalLayout />
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
