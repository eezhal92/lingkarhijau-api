import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { UnprocessableEntityError, HTTPError } from './lib/errors';
import * as Sentry from '@sentry/node';

export default function createServer({ routes }) {
  const app = express();

  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());

  app.use(cors({
    origin: '*',
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use('/api', routes);

  app.use(Sentry.Handlers.errorHandler());

  app.use((error, request, response, next) => {
    if (error instanceof HTTPError) {
      if (error instanceof UnprocessableEntityError) {
        return response.status(error.statusCode).json(error.errors);
      } else {
        return response.status(error.statusCode).json({
          message: error.message,
        });
      }
    }

    next(error);
  });

  return {
    app,
    start: () => new Promise((resolve) => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`[http] Listening on port: ${port}`);
        resolve();
      });
    })
  }
}
