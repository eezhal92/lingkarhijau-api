require('dotenv').config();

import container from './src/container';

const app = container.resolve('app');

app.start();
