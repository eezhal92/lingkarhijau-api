import { registerHandlers as registerTrashPricingHandlers } from './modules/trash-pricing/hooks';

export default function registerHandlers (cradle) {
  return () => {
    console.log('Registering command/event handlers...')
    registerTrashPricingHandlers(cradle);

    return Promise.resolve();
  };
}
