import {
  TrashPricingCreatedEvent,
  TrashPricingUpdatedEvent,
  TrashPricingArchivedEvent,
  TrashPricingUnarchivedEvent,
} from './event';

export default class TrashPricingView {
  constructor(TrashPricingReadModel) {
    this.trashPricingReadModel = TrashPricingReadModel;
    this.handle = this.handle.bind(this);
  }

  /**
   *
   * @param {import("./event").TrashPricingCreatedEvent} event
   */
  async handle(event) {
    if (event instanceof TrashPricingCreatedEvent) {
      return this.trashPricingReadModel.create({
        _id: event.data.id,
        ...event.data,
      });
    }

    if (event instanceof TrashPricingUpdatedEvent) {
      return await this.trashPricingReadModel.findByIdAndUpdate(
        event.data.id,
        event.data,
      );
    }
    const isArchivingEvent = event instanceof TrashPricingArchivedEvent || event instanceof TrashPricingUnarchivedEvent;
    if (isArchivingEvent) {
      return await this.trashPricingReadModel.findByIdAndUpdate(
        event.data.id,
        { archived: event.data.archived },
      );
    }
  }
}
