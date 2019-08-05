import * as awilix from 'awilix';

import app from './app';

import routes from './routes';
import server from './server';

import es from './es';
import Bus from './lib/bus';
import { UserBalanceQueue } from './lib/queue';
import registerHandlers from './handlers-registration';

import PickupModel from './db/models/Pickup';
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

  userBalanceQueue: awilix.asClass(UserBalanceQueue).singleton(),
  TrashPricingReadModel: awilix.asValue(TrashPricingReadModel),
  TransactionReadModel: awilix.asValue(TransactionReadModel),
  UserBalanceReadModel: awilix.asValue(UserBalanceReadModel),
  PickupModel: awilix.asValue(PickupModel),
});

registerTrashPricingServices(container);
registerTransactionServices(container);

export default container;
