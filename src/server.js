import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { UnprocessableEntityError, HTTPError } from './lib/errors';

export default function createServer({ routes }) {
  const app = express();

  app.use(cors({
    origin: '*',
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use('/api', routes);

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
