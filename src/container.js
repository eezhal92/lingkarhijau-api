import * as awilix from 'awilix';
import app from './app';
import server from './server';
import routes from './routes';
import Bus from './lib/bus';
import es from './es';

import registerHandlers from './handlers-registration';
import TrashPricingReadModel from './db/models/TrashPricing';
import TransactionReadModel from './db/models/Transaction';
import UserBalanceReadModel from './db/models/UserBalance';
import { registerServices as registerTransactionServices } from './modules/transaction/hooks';
import { registerServices as registerTrashPricingServices } from './modules/trash-pricing/hooks';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  app: awilix.asFunction(app).singleton(),
  server: awilix.asFunction(server).singleton(),
  bus: awilix.asClass(Bus).singleton(),
  eventstore: awilix.asFunction(es).singleton(),
  routes: awilix.asFunction(routes).singleton(),
  registerHandlers: awilix.asFunction(registerHandlers),

  TrashPricingReadModel: awilix.asValue(TrashPricingReadModel),
  TransactionReadModel: awilix.asValue(TransactionReadModel),
  UserBalanceReadModel: awilix.asValue(UserBalanceReadModel),
});

registerTrashPricingServices(container);
registerTransactionServices(container);

export default container;
