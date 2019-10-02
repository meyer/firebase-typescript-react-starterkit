import * as express from 'express';

export const apiRouter = express.Router();

apiRouter.get('/api', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'it works!',
  });
});

apiRouter.get('/api/*', (_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Page not found',
  });
});
