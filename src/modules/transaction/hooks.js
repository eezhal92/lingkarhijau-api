import { asClass } from 'awilix';
import { AccountBalanceRepo } from './infra/es-repo';
import { AccountBalanceView } from './projection';
import { AccountBalanceAddedEvent, AccountBalanceReducedEvent } from './domain/event';
import { CreateTransactionCommand } from './domain/command';
import { CreateTransactionCommandHandler } from './command-handler';

/**
 * Register to ioc container
 * @param {import("awilix").AwilixContainer}
 */
export function registerServices(container) {
  container.register({
    accountBalanceESRepo: asClass(AccountBalanceRepo).singleton(),
  });
}

/**
 * @param {object} payload
 * @param {import("../../lib/bus").default} payload.bus
 * @param {any} payload.trashPricingESRepo
 * @param {any} payload.TrashPricingReadModel
 */
export function registerHandlers({
  bus,
  accountBalanceQueue,
  accountBalanceESRepo,
  TransactionReadModel,
  AccountBalanceReadModel,
  PickupModel,
}) {
  accountBalanceQueue.register(new AccountBalanceView(AccountBalanceReadModel).handle);

  bus.registerHandler(CreateTransactionCommand, new CreateTransactionCommandHandler(TransactionReadModel, accountBalanceESRepo, PickupModel).handle);
  bus.registerHandler(AccountBalanceAddedEvent, accountBalanceQueue.push);
  bus.registerHandler(AccountBalanceReducedEvent, accountBalanceQueue.push);
}
