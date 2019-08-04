import bluebird from 'bluebird';

class Bus {
  constructor() {
    this.routes = new Map();
  }

  registerHandler(classRef, handler) {
    if (!this.routes.has(classRef.name)) {
      const handlers = []
      this.routes.set(classRef.name, handlers)
    }

    this.routes.get(classRef.name).push(handler)
  }

  send(command) {
    const commandClassName = command.constructor.name

    if (this.routes.has(commandClassName)) {
      const commandHandler = this.routes.get(commandClassName)[0];
      commandHandler(command);
    }
  }

  /**
   * @param {object} event
   */
  publish(event) {
    const eventClassName = event.constructor.name

    if (!this.routes.has(eventClassName)) return;

    const handlers = this.routes.get(eventClassName)

    bluebird.each(handlers, async (eventHandler) => {
      return eventHandler(event);
    });
  }
}

export default Bus;
