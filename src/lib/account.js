export function createRegistrationNumber(previousRegistrationNumber) {
  if (
    typeof previousRegistrationNumber === 'string' &&
    previousRegistrationNumber.length !== 9
  ) {
    throw new Error('registration number length should be 9. found:' + previousRegistrationNumber.length);
  }

  let lastOrderNumber = 0;
  if (previousRegistrationNumber) {
    lastOrderNumber = Number(previousRegistrationNumber.slice(4));
  }

  const nextOrderNumber = lastOrderNumber + 1;
  const date = new Date(Date.now());
  const yymm = date.toISOString().slice(2, 7).replace('-', '');
  const paddedOrderNumber = nextOrderNumber.toString().padStart(5, 0);
  return yymm + paddedOrderNumber;
}
