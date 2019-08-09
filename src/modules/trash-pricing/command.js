export class CreateTrashPricingCommand {
  /**
   * @param {object} data
   * @param {string} data.actor Id of user
   * @param {string} data.name
   * @param {string} data.type
   * @param {string} data.unit
   * @param {number} data.price
   * @param {string} data.description
   */
  constructor(data) {
    this.data = data;
  }
}

export class UpdateTrashPricingCommand {
  /**
   * @param {object} data
   * @param {string} data.actor Id of user
   * @param {string} data.id
   * @param {string} data.name
   * @param {string} data.type
   * @param {string} data.unit
   * @param {number} data.price
   * @param {string} data.description
   */
  constructor(data) {
    this.data = data;
  }
}

export class ToggleTrashPricingCommand {
  /**
   * @param {object} data
   * @param {string} data.actor    Id of user
   * @param {string} data.id
   * @param {string} data.archived
   */
  constructor(data) {
    this.data = data;
  }
}
