import { ApolloServer } from 'apollo-server-cloud-functions';

import { apolloConfig } from './apolloConfig';

declare module '@apollographql/graphql-playground-html/dist/render-playground-page' {
  export interface ISettings {
    'schema.polling.enable'?: boolean;
  }
}

const server = new ApolloServer({
  ...apolloConfig,
  playground: {
    settings: {
      'schema.polling.enable': false,
      'editor.fontFamily':
        "'SF Mono', 'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
    },
  },
  introspection: true,
});

export const handleGraphQLRequest = server.createHandler();
