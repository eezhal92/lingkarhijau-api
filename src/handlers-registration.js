import { registerHandlers as registerTransactionHandlers } from './modules/transaction/hooks';
import { registerHandlers as registerTrashPricingHandlers } from './modules/trash-pricing/hooks';

export default function registerHandlers (cradle) {
  return () => {
    console.log('Registering command/event handlers...')

    registerTrashPricingHandlers(cradle);
    registerTransactionHandlers(cradle);

    return Promise.resolve();
  };
}
