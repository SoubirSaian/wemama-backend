// interface B2CPriceInput {
//   distanceKm: number;
//   addOns: {
//     expressPickup?: boolean;
//     nightPickup?: boolean;
//     twoManCrew?: boolean;
//     noElevator?: boolean;
//     heavyLoad?: number; // 50–100 SAR
//   };
//   commissionPercent: number; // 25–32
// }

// function calculateDistancePrice(distanceKm: number): number {
//   if (distanceKm <= 20) return distanceKm * 5;
//   if (distanceKm <= 50) return distanceKm * 4;
//   return distanceKm * 3;
// }

// function calculateAddOns(addOns: any): number {
//   let total = 0;
//   if (addOns.expressPickup) total += 40;
//   if (addOns.nightPickup) total += 30;
//   if (addOns.twoManCrew) total += 60;
//   if (addOns.noElevator) total += 40;
//   if (addOns.heavyLoad) total += addOns.heavyLoad;
//   return total;
// }

// export function calculateB2CPrice(input: B2CPriceInput) {
//   const baseFee = 49;
//   const distanceFee = calculateDistancePrice(input.distanceKm);
//   const addOnsFee = calculateAddOns(input.addOns);

//   const subtotal = baseFee + distanceFee + addOnsFee;

//   const platformCommission = (subtotal * input.commissionPercent) / 100;

//   const driverEarning = subtotal - platformCommission;

//   return {
//     baseFee,
//     distanceFee,
//     addOnsFee,
//     subtotal,
//     platformCommission,
//     driverEarning,
//     totalCustomerPays: subtotal, // commission hidden
//   };
// }


import { PricingInput, PricingBreakdown } from "./pricing.types";
import { B2C_CONFIG } from "./pricing.config";
import { calculateDistanceFee, calculateAddOnsFee } from "./helpers";

export function calculateB2CPrice(
  input: PricingInput
): PricingBreakdown {
  const baseFee = B2C_CONFIG.baseFee;

  const distanceFee = calculateDistanceFee(
    input.distanceKm,
    B2C_CONFIG.distanceRates
  );

  const addOnsFee = calculateAddOnsFee(
    input.addOns,
    B2C_CONFIG.addOns
  );

  const subtotal = baseFee + distanceFee + addOnsFee;

  const platformCommission =
    (subtotal * input.commissionPercent) / 100;

  const driverEarning = subtotal - platformCommission;

  return {
    baseFee,
    distanceFee,
    addOnsFee,
    subtotal,
    platformCommission,
    driverEarning,
    totalCustomerPays: subtotal, // commission hidden
  };
}


