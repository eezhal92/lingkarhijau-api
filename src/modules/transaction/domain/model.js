export class UserBalance {
  constructor({
    id,
    user,
    balance,
    createdAt,
    updatedAt,
  } = {}) {
    this.id = id;
    this.user = user;
    this.balance = balance || 0;
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
   * @param  {string} snap.data.id
   * @param  {string} snap.data.user
   * @param  {number} snap.data.balance
   * @param  {string} snap.data.createdAt
   * @param  {string} snap.data.updatedAt
   */
  loadSnapshot(snapshot) {
    if (!snapshot) {
      console.log('snapshot is null')
      return;
    }

    const data = snapshot.data;

    this.aggregateId = data.id;
    this.id = data.id;
    this.user = data.user;
    this.balance = data.balance;
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
    if (event.name === 'UserBalanceAddedEvent') {
      this.balance += event.data.amount;
    } else if (event.name === 'UserBalanceReducedEvent') {
      this.balance -= event.data.amount;
    }

    if (isNew) {
      this.changes.push(event);
    }
  }

  getSnap() {
    return {
      id: this.id,
      user: this.user,
      balance: this.balance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
