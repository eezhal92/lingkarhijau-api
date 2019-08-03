import * as awilix from 'awilix';
import app from './app';
import server from './server';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  app: awilix.asFunction(app).singleton(),
  server: awilix.asFunction(server).singleton(),
});

export default container;
