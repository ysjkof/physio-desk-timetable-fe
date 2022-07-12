import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Router from "./router/Router";

function App() {
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <BrowserRouter>
          <Router />;
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
