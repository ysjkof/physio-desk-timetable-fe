import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { client } from './apollo';
import Router from './router/Router';

function App() {
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
