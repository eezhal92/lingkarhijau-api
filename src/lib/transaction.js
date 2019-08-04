export const TransactionTypes = Object.freeze({
  DEPOSIT: 'deposit',     // User want to donate the trash
  QUICKCASH: 'quickcash', // Deposit
  DONATION: 'donation',   // cash in place
  REDEEM: 'redeem',       // cash in place
});

export function getTransactionTypes() {
  return Object.values(TransactionTypes);
}
