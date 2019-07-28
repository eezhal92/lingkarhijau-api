export const PickupStatus = Object.freeze({
  PLACED: 1,    // Pickup request is placed
  DONE: 2,      // Our pick up crew already collect the trash
  CANCELLED: 3, // Cancelled by user or our team
});

export const PickupType = Object.freeze({
  DONATION: 'donation',    // User want to donate the trash
  DEPOSIT: 'deposit',      // Deposit
  CASH: 'cash',            // cash in place
});

export function getPickupTypes() {
  return Object.values(PickupType);
}
