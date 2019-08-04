import { asClass } from 'awilix';
import { UserBalanceRepo } from './infra/es-repo';
import { UserBalanceView } from './projection';
import { UserBalanceAddedEvent, UserBalanceReducedEvent } from './domain/event';
import { CreateTransactionCommand } from './domain/command';
import { CreateTransactionCommandHandler } from './command-handler';

/**
 * Register to ioc container
 * @param {import("awilix").AwilixContainer}
 */
export function registerServices(container) {
  container.register({
    userBalanceESRepo: asClass(UserBalanceRepo).singleton(),
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
  userBalanceESRepo,
  TransactionReadModel,
  UserBalanceReadModel,
}) {
  bus.registerHandler(CreateTransactionCommand, new CreateTransactionCommandHandler(TransactionReadModel, userBalanceESRepo).handle);
  bus.registerHandler(UserBalanceAddedEvent, new UserBalanceView(UserBalanceReadModel).handle);
  bus.registerHandler(UserBalanceReducedEvent, new UserBalanceView(UserBalanceReadModel).handle);
}
