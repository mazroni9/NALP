/**
 * Resolves AssumptionsBundle to the numeric inputs consumed by the shared engine.
 * Used when running scenarios (downside/base/upside) so the engine is not duplicated.
 */

import type { AssumptionsBundle } from "./assumptions";

export interface ResolvedEngineInputs {
  requiredCapital: { A: number; B: number; C: number; D: number };
  capRate: number;
  waterfall: {
    preferredReturnRateDecimal: number;
    residualSplit: { land: number; investor: number; operator: number };
  };
  zoneA: {
    carsPerDay: readonly number[];
    avgCommissionPerCar: readonly number[];
    daysPerYear: number;
    opexCapPercent: number;
    landOwnerCutPerCarPreBreakeven: number;
    landOwnerPostBreakevenSharePercent: number;
  };
  zoneB: { annualRevenue: number; netAnnual: number };
  zoneC: { annualRevenue: number; netAnnual: number };
  zoneD: {
    annualRevenue: number;
    netAnnual: number;
    investorSharePre: number;
    investorSharePost: number;
    breakevenMonths: number;
  };
}

/**
 * Converts an assumptions bundle into the resolved form expected by the engine.
 * All calculations (e.g. netAnnual, zone C revenue from rooms×occupancy×price) are done here.
 */
export function resolveAssumptionsToEngineInputs(bundle: AssumptionsBundle): ResolvedEngineInputs {
  const { project, zoneA, zoneB, zoneC, zoneD } = bundle;

  const zoneCAnnualRevenue =
    zoneC.totalRooms * (zoneC.occupancyDefault / 100) * zoneC.avgRoomPrice * 12;
  const zoneCNetAnnual = zoneCAnnualRevenue * (1 - zoneC.opexPercent / 100);

  const zoneDNetAnnual = zoneD.annualRevenue * (1 - zoneD.opexPercent / 100);
  const investorSharePre = 1 - zoneD.preBreakevenSharePercent / 100;
  const investorSharePost = zoneD.postBreakevenSharePercent / 100;

  return {
    requiredCapital: { ...project.requiredCapital },
    capRate: project.capRate,
    waterfall: {
      preferredReturnRateDecimal: project.waterfall.preferredReturnRateDecimal,
      residualSplit: { ...project.waterfall.residualSplit },
    },
    zoneA: {
      carsPerDay: zoneA.carsPerDay,
      avgCommissionPerCar: zoneA.avgCommissionPerCar,
      daysPerYear: zoneA.daysPerYear,
      opexCapPercent: zoneA.opexCapPercent,
      landOwnerCutPerCarPreBreakeven: zoneA.landOwnerCutPerCarPreBreakeven,
      landOwnerPostBreakevenSharePercent: zoneA.landOwnerPostBreakevenSharePercent,
    },
    zoneB: {
      annualRevenue: zoneB.annualRevenue,
      netAnnual: zoneB.annualRevenue - zoneB.opexFixed,
    },
    zoneC: {
      annualRevenue: Math.round(zoneCAnnualRevenue),
      netAnnual: Math.round(zoneCNetAnnual),
    },
    zoneD: {
      annualRevenue: zoneD.annualRevenue,
      netAnnual: Math.round(zoneDNetAnnual),
      investorSharePre,
      investorSharePost,
      breakevenMonths: zoneD.breakevenMonths,
    },
  };
}
