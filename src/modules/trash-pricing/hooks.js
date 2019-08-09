import { asClass } from 'awilix';

import { TrashPricingESRepo } from './es-repo';
import TrashPricingView from './projection';
import {
  TrashPricingCreatedEvent,
  TrashPricingUpdatedEvent,
  TrashPricingArchivedEvent,
  TrashPricingUnarchivedEvent,
} from './event';
import {
  CreateTrashPricingCommand,
  UpdateTrashPricingCommand,
  ToggleTrashPricingCommand,
} from './command';
import {
  CreateTrashPricingCommandHandler,
  UpdateTrashPricingCommandHandler,
  ToggleTrashPricingCommandHandler,
} from './command-handler';

/**
 * Register to ioc container
 * @param {import("awilix").AwilixContainer}
 */
export function registerServices(container) {
  container.register({
    trashPricingESRepo: asClass(TrashPricingESRepo).singleton(),
  });
}

/**
 * @param {object} payload
 * @param {import("../../lib/bus").default} payload.bus
 * @param {any} payload.trashPricingESRepo
 * @param {any} payload.TrashPricingReadModel
 */
export function registerHandlers({ bus, trashPricingESRepo, TrashPricingReadModel }) {
  bus.registerHandler(CreateTrashPricingCommand, new CreateTrashPricingCommandHandler(trashPricingESRepo).handle);
  bus.registerHandler(UpdateTrashPricingCommand, new UpdateTrashPricingCommandHandler(trashPricingESRepo).handle);
  bus.registerHandler(ToggleTrashPricingCommand, new ToggleTrashPricingCommandHandler(trashPricingESRepo).handle);
  bus.registerHandler(TrashPricingCreatedEvent, new TrashPricingView(TrashPricingReadModel).handle);
  bus.registerHandler(TrashPricingUpdatedEvent, new TrashPricingView(TrashPricingReadModel).handle);
  bus.registerHandler(TrashPricingArchivedEvent, new TrashPricingView(TrashPricingReadModel).handle);
  bus.registerHandler(TrashPricingUnarchivedEvent, new TrashPricingView(TrashPricingReadModel).handle);
}
