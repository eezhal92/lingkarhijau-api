export const TrashTypes = Object.freeze({
  PLASTIC: 'plastic',
  PAPER: 'paper',
  ALUMUNIUM: 'alumunium',
  METAL: 'metal',
  CARDBOARD: 'cardboard',
});

export const getValidTrashTypes = () => Object.values(TrashTypes);
