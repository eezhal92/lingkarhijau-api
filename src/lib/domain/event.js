export class DomainEvent {
  constructor() {
    this.name = this.constructor.name;
  }
}
