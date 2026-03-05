export const COMMISSION_RANGE = {
  MIN: 25,
  MAX: 32,
};

export const B2C_CONFIG = {
  baseFee: 49,
  distanceRates: [
    { upto: 20, rate: 5 },
    { upto: 50, rate: 4 },
    { above: 50, rate: 3 },
  ],
  addOns: {
    expressPickup: 40,
    nightPickup: 30,
    twoManCrew: 60,
    noElevator: 40,
  },
};

export const B2B_CONFIG = {
  baseFee: 49,
  distanceRates: [
    { upto: 30, rate: 6 },
    { upto: 80, rate: 5 },
    { above: 80, rate: 4 },
  ],
  addOns: {
    expressSLA: [60, 100],
    nightOperations: 50,
    crew: [80, 150],
    heavyWaste: [80, 150],
  },
};

export const GOV_CONFIG = {
  pickupFee: 1.2,
  perTonFee: 12,
};
