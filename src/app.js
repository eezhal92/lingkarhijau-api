import express from 'express';
import bodyParser from 'body-parser';

import routes from './routes';
import { UnprocessableEntityError } from './lib/errors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', routes);

app.use((error, request, response, next) => {
  if (error instanceof UnprocessableEntityError) {
    return response.status(error.statusCode).json(error.errors);
  }

  next(error);
});

export default app;
