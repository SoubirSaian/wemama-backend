export type JobType = "B2C" | "B2B" | "GOV";

export interface AddOns {
  expressPickup?: boolean;
  nightPickup?: boolean;
  twoManCrew?: boolean;
  noElevator?: boolean;
  heavyLoad?: number; // 50–150 SAR
}

export interface PricingInput {
  jobType: JobType;
  distanceKm: number;
  addOns?: AddOns;
  commissionPercent: number; // 25–32
}

export interface PricingBreakdown {
  baseFee: number;
  distanceFee: number;
  addOnsFee: number;
  subtotal: number;
  platformCommission: number;
  driverEarning: number;
  totalCustomerPays: number;
}
