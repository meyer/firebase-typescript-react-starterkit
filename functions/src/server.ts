// tslint:disable: ordered-imports
import './setup';

import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as path from 'path';

import { apolloConfig } from './graphql/apolloConfig';
import { apiRouter } from './api/apiRouter';

const app = express();
const uiPath = path.resolve(__dirname, '..', '..', 'ui', 'build');
const apolloServer = new ApolloServer(apolloConfig);

app.all(['/api', '/api/*'], apiRouter);
app.use(express.static(uiPath));
app.use(apolloServer.getMiddleware());
app.listen(process.env.PORT || 3000);
