require('dotenv').config();

import app from './src/server';
import * as db from './src/db';

const port = process.env.PORT || 3000;

Promise.resolve()
  .then(db.connect)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  });
