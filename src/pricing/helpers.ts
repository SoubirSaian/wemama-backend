export function calculateDistanceFee(
  distanceKm: number,
  rates: any[]
): number {
  for (const rule of rates) {
    if (rule.upto && distanceKm <= rule.upto) {
      return distanceKm * rule.rate;
    }
    if (rule.above && distanceKm > rule.above) {
      return distanceKm * rule.rate;
    }
  }
  return 0;
}

export function calculateAddOnsFee(
  addOns: any,
  prices: any
): number {
  let total = 0;

  if (!addOns) return total;

  for (const key of Object.keys(addOns)) {
    if (typeof addOns[key] === "boolean" && addOns[key]) {
      total += prices[key] ?? 0;
    }
    if (typeof addOns[key] === "number") {
      total += addOns[key];
    }
  }

  return total;
}
