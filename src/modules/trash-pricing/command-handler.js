import mongoose from 'mongoose';
import { TrashPricing } from './domain';
import { TrashPricingCreatedEvent, TrashPricingUpdatedEvent } from './event';

export class CreateTrashPricingCommandHandler {
  /**
   * @param  {TrashPricingESRepo} trashPricingESRepo
   */
  constructor(trashPricingESRepo) {
    this.trashPricingESRepo = trashPricingESRepo;
    this.handle = this.handle.bind(this);
  }

  /**
   * @param {import("./command").CreateTrashPricingCommand} command
   */
  async handle(command) {
    const trashPricing = new TrashPricing();

    trashPricing.apply(new TrashPricingCreatedEvent({
      id: mongoose.Types.ObjectId().toString(),
      name: command.data.name,
      type: command.data.type,
      price: command.data.price,
      description: command.data.description || '',
    }), true);

    this.trashPricingESRepo.save(trashPricing);
  }
}

export class UpdateTrashPricingCommandHandler {
  /**
   * @param  {TrashPricingESRepo} trashPricingESRepo
   */
  constructor(trashPricingESRepo) {
    this.trashPricingESRepo = trashPricingESRepo;
    this.handle = this.handle.bind(this);
  }

  async handle(command) {
    const trashPricing = await this.trashPricingESRepo.findById(command.data.id);

    if (!trashPricing) {
      console.log('cannot find trash pricing id ', command.data.id);
      return;
    }

    trashPricing.apply(new TrashPricingUpdatedEvent({
      id: command.data.id,
      name: command.data.name,
      price: command.data.price,
      type: command.data.type,
      description: command.data.description
    }), true);

    this.trashPricingESRepo.save(trashPricing);
  }
}
