export class TrashPricing {
  constructor({
    id,
    type,
    name,
    archived = false,
    price,
    unit,
    createdAt,
    updatedAt,
  } = {}) {
    this.aggregateId = id;
    this.id = id;
    this.type = type;
    this.name = name;
    this.archived = archived;
    this.price = price;
    this.unit = unit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.changes = [];
  }

  getUncommittedChanges() {
    return this.changes;
  }

  markChangesAsCommitted() {
    this.changes = [];
  }

  /**
   * @param  {object|null} snapshot
   * @param  {object} snapshot.data
   * @param  {string} snap.data.userID
   * @param  {number} snap.data.balance
   */
  loadSnapshot(snapshot) {
    if (!snapshot) {
      console.log('snapshot is null')
      return;
    }
    const data = snapshot.data;
    this.aggregateId = data.id;
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.unit = data.unit;
    this.archived = data.archived;
    this.price = data.price;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * @param  {Array} history transaction history
   */
  loadFromHistory(history) {
    for (let i = 0; i < history.length; i += 1) {
      const event = history[i];
      this.apply(event);
    }
  }

  apply(event, isNew = false) {
    if (event.name === 'TrashPricingCreatedEvent') {
      this.handleCreateEvent(event.data);
    } else if (event.name === 'TrashPricingUpdatedEvent') {
      this.handleUpdateEvent(event.data);
    } else if (event.name === 'TrashPricingArchivedEvent') {
      this.archived = true;
      this.updatedAt = new Date().toISOString();
    } else if (event.name === 'TrashPricingUnarchivedEvent') {
      this.archived = false;
      this.updatedAt = new Date().toISOString();
    }

    if (isNew) {
      this.changes.push(event);
    }
  }

  handleCreateEvent (data) {
    this.aggregateId = data.id;
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.price = data.price;
    this.unit = data.unit;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  handleUpdateEvent (data) {
    this.type = data.type;
    this.name = data.name;
    this.price = data.price;
    this.unit = data.unit;
    this.description = data.description;
    this.updatedAt = data.updatedAt;
  }

  getSnap() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      price: this.price,
      unit: this.unit,
      archived: this.archived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
