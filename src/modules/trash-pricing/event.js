import { DomainEvent } from '../../lib/domain/event';

export class TrashPricingCreatedEvent extends DomainEvent {
  constructor({ id, name, price, type, unit, actor, description } = {}) {
    super();

    const now = new Date().toISOString();

    this.data = {
      id: id,
      name: name,
      price: price,
      actor: actor,
      unit: unit,
      type: type,
      archived: false,
      description: description,
      createdAt: now,
      updatedAt: now,
    }
  }
}

export class TrashPricingUpdatedEvent extends DomainEvent {
  constructor({ id, name, price, unit, type, description } = {}) {
    super();

    const now = new Date().toISOString();

    this.data = {
      id: id,
      name: name,
      price: price,
      unit: unit,
      actor: actor,
      type: type,
      archived: false,
      description: description,
      updatedAt: now,
    };
  }
}

export class TrashPricingArchivedEvent extends DomainEvent {
  constructor({ id, actor } = {}) {
    super();

    const now = new Date().toISOString();

    this.data = {
      id,
      actor,
      archived: true,
      updatedAt: now,
    };
  }
}

export class TrashPricingUnarchivedEvent extends DomainEvent {
  constructor({ id, actor } = {}) {
    super();

    const now = new Date().toISOString();

    this.data = {
      id,
      actor,
      archived: false,
      updatedAt: now,
    };
  }
}
