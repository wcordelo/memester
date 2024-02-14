import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import * as React from "react";

import { AuthContextProvider } from "../context/AuthContext";
import { getCurrentAccessToken } from "../store/auth";
import { cursorBasedPagination, publicationKeyFields } from "../utils/lens-apollo";

const httpLink = new HttpLink({ uri: import.meta.env.VITE_LENS_API });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getCurrentAccessToken();

  operation.setContext({
    headers: {
      "x-access-token": accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  return forward(operation);
});

const cache = new InMemoryCache({
  possibleTypes: {
    CollectModule: ["FreeCollectModuleSettings", "MultirecipientFeeCollectModuleSettings"],
  },
  typePolicies: {
    Post: { keyFields: publicationKeyFields },
    Comment: { keyFields: publicationKeyFields },
    Mirror: { keyFields: publicationKeyFields },
    Query: {
      fields: {
        publication: { keyArgs: ["request", ["publicationId"]] },
        publications: cursorBasedPagination(["request", ["profileId", "commentsOf", "publicationTypes"]]),
        explorePublications: cursorBasedPagination(["request", ["sortCriteria", "metadata", ["tags"]]]),
        timeline: cursorBasedPagination(["request", ["profileId"]]),
      },
    },
  },
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  connectToDevTools: !!import.meta.env.DEV,
});

export function ApolloAuthProvider({ children }: { children?: React.ReactNode }): JSX.Element {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </ApolloProvider>
  );
}
