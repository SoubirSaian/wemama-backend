import { PricingInput, PricingBreakdown } from "./pricing.types";
import { B2B_CONFIG } from "./pricing.config";
import { calculateDistanceFee } from "./helpers";

export function calculateB2BPrice(
  input: PricingInput
): PricingBreakdown {
  const baseFee = B2B_CONFIG.baseFee;

  const distanceFee = calculateDistanceFee(
    input.distanceKm,
    B2B_CONFIG.distanceRates
  );

  // B2B add-ons are usually custom priced
  const addOnsFee = 0;

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
    totalCustomerPays: subtotal,
  };
}
