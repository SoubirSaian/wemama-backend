import { GOV_CONFIG } from "./pricing.config";

export function calculateGovernmentInvoice(
  pickups: number,
  tons: number,
  modules: {
    illegalDumpingAI?: boolean;
    districtKPIs?: boolean;
    aiRouting?: boolean;
    driverCompliance?: boolean;
    esg?: boolean;
    forecasting?: boolean;
  }
) {
  let total = pickups * GOV_CONFIG.pickupFee;
  total += tons * GOV_CONFIG.perTonFee;

  if (modules.illegalDumpingAI) total += 0.9;
  if (modules.districtKPIs) total += 0.7;
  if (modules.aiRouting) total += 0.6;
  if (modules.driverCompliance) total += 0.5;
  if (modules.esg) total += 0.4;
  if (modules.forecasting) total += 0.3;

  return total;
}
