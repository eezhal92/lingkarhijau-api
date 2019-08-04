export class CreateTrashPricingCommand {
  /**
   * @param {object} data
   * @param {string} data.name
   * @param {string} data.type
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
   * @param {string} data.id
   * @param {string} data.name
   * @param {string} data.type
   * @param {number} data.price
   * @param {string} data.description
   */
  constructor(data) {
    this.data = data;
  }
}
