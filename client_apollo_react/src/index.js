import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './App';
import { signOut } from './components/SignOut';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql',
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8000/graphql`,
  options: {
    reconnect: true,
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);


// Cookies as storage do NOT require state to be saved on the server if you are storing a JWT in the cookie
// JWT has everything the server needs without storing state
// Header + Payload + Signature/PublicKey
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    // Token can be stored in either ...
    // LOCAL STORAGE 
    // or
    // SESSION STORAGE
    // or
    // a cookie 
    const token = localStorage.getItem('token');

    if (token) {
      headers = { ...headers, 'x-token': token };
    }

    return { headers };
  });

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log('error message ==> ', message);
      console.log('graphQLErrors ==> ', graphQLErrors);
      console.log('networkError ==> ', networkError); 

      if (message === 'UNAUTHENTICATED') {
        signOut(client);
      }
      if (message === 'Context creation failed: TokenExpiredError: jwt expired') {
        signOut(client);
      }
    });
  }

  if (networkError) {
    console.error('Network error', networkError);

    if (networkError.statusCode === 401) {
      signOut(client);
    }
  }
});

const link = ApolloLink.from([authLink, errorLink, terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
