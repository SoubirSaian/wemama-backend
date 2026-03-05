import { PricingInput } from "./pricing.types";
import { calculateB2CPrice } from "./B2CPricing";
import { calculateB2BPrice } from "./B2BPricing";

export function calculatePrice(input: PricingInput) {
  switch (input.jobType) {
    case "B2C":
      return calculateB2CPrice(input);
    case "B2B":
      return calculateB2BPrice(input);
    default:
      throw new Error("Unsupported job type");
  }
}
