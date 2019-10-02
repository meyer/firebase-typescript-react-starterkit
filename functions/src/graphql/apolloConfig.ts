import { Config } from 'apollo-server-core';
import { AnyScalarType } from '~/graphql/scalars/AnyScalarType';

import typeDefs from './schema.gql';

const resolvers: GQL.Resolvers = {
  Query: {
    hello: (_, args) => `Hello, ${args.name}!`,
  },
  Mutation: {
    goodbye: (_, args) => `Goodbye, ${args.name}`,
  },

  Any: AnyScalarType,
};

export const apolloConfig: Config = {
  typeDefs,
  // our types are better :D
  resolvers: resolvers as any,
};
