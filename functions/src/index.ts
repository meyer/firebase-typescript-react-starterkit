// tslint:disable: ordered-imports
import './setup';

import * as functions from 'firebase-functions';
import { apiRouter } from '~/api/apiRouter';
import { handleGraphQLRequest } from '~/graphql/graphqlRequestHandler';

// REST API
export const api = functions.https.onRequest(apiRouter);

// GraphQL API
export const graphql = functions.https.onRequest(handleGraphQLRequest);
