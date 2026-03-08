/**
 * Scenario input layer — downside / base / upside.
 * Single shared engine; scenarios only change the assumptions bundle.
 *
 * Scenario philosophy (post-calibration):
 * - Downside: تعثر معقول — إيراد أقل، opex أعلى، cap rate أعلى (تقييم أقل). يعكس تأخر تشغيل أو طلب أضعف.
 * - Base: واقعي وقابل للدفاع — افتراضات معايرة (رامب محافظ، إشغال/إيراد دون مبالغة). لا متفائل.
 * - Upside: طموح لكن ليس خيالي — إيراد أعلى، opex أقل، cap أقل (تقييم أعلى). يبقى ضمن نطاق قابل للتحقق.
 */

import {
  getDefaultAssumptionsBundle,
  type AssumptionsBundle,
} from "./assumptions";

export type ScenarioId = "downside" | "base" | "upside";

/**
 * Returns the assumptions bundle for the given scenario.
 * Base = calibrated default (realistic); downside = stress; upside = achievable stretch.
 */
export function getScenarioAssumptions(scenarioId: ScenarioId): AssumptionsBundle {
  const base = getDefaultAssumptionsBundle();

  if (scenarioId === "base") {
    return base;
  }

  if (scenarioId === "downside") {
    return applyDownside(base);
  }

  if (scenarioId === "upside") {
    return applyUpside(base);
  }

  return base;
}

/** Conservative: lower revenue, higher opex, same or lower cap rate */
function applyDownside(b: AssumptionsBundle): AssumptionsBundle {
  const rev = 0.75; // revenue factor
  const opexUp = 1.15; // opex higher
  const capRate = Math.min(0.11, b.project.capRate + 0.02); // higher cap rate = lower valuation

  return {
    project: {
      ...b.project,
      capRate,
    },
    zoneA: {
      ...b.zoneA,
      carsPerDay: b.zoneA.carsPerDay.map((c) => Math.round(c * rev)),
      avgCommissionPerCar: b.zoneA.avgCommissionPerCar.map((x) => Math.round(x * rev)),
      opexCapPercent: Math.min(35, Math.round(b.zoneA.opexCapPercent * opexUp)),
    },
    zoneB: {
      annualRevenue: Math.round(b.zoneB.annualRevenue * rev),
      opexFixed: Math.round(b.zoneB.opexFixed * opexUp),
    },
    zoneC: {
      ...b.zoneC,
      occupancyDefault: Math.max(60, b.zoneC.occupancyDefault - 15),
      avgRoomPrice: Math.round(b.zoneC.avgRoomPrice * rev),
      opexPercent: Math.min(15, b.zoneC.opexPercent + 2),
    },
    zoneD: {
      ...b.zoneD,
      monthlyRevenue: Math.round(b.zoneD.monthlyRevenue * rev),
      annualRevenue: Math.round(b.zoneD.annualRevenue * rev),
      opexPercent: Math.min(20, b.zoneD.opexPercent + 3),
      preBreakevenSharePercent: Math.max(5, b.zoneD.preBreakevenSharePercent - 2),
    },
  };
}

/** Upside: achievable stretch — higher revenue, lower opex; cap rate one step below base (not aggressive 7%). */
function applyUpside(b: AssumptionsBundle): AssumptionsBundle {
  const rev = 1.15;
  const opexDown = 0.9;
  const capRate = Math.max(0.08, b.project.capRate - 0.02);

  return {
    project: {
      ...b.project,
      capRate,
    },
    zoneA: {
      ...b.zoneA,
      carsPerDay: b.zoneA.carsPerDay.map((c) => Math.round(c * rev)),
      avgCommissionPerCar: b.zoneA.avgCommissionPerCar.map((x) => Math.round(x * rev)),
      opexCapPercent: Math.max(20, Math.round(b.zoneA.opexCapPercent * opexDown)),
    },
    zoneB: {
      annualRevenue: Math.round(b.zoneB.annualRevenue * rev),
      opexFixed: Math.round(b.zoneB.opexFixed * opexDown),
    },
    zoneC: {
      ...b.zoneC,
      occupancyDefault: Math.min(95, b.zoneC.occupancyDefault + 10),
      avgRoomPrice: Math.round(b.zoneC.avgRoomPrice * rev),
      opexPercent: Math.max(8, b.zoneC.opexPercent - 1),
    },
    zoneD: {
      ...b.zoneD,
      monthlyRevenue: Math.round(b.zoneD.monthlyRevenue * rev),
      annualRevenue: Math.round(b.zoneD.annualRevenue * rev),
      opexPercent: Math.max(12, b.zoneD.opexPercent - 2),
      preBreakevenSharePercent: Math.min(15, b.zoneD.preBreakevenSharePercent + 2),
    },
  };
}
