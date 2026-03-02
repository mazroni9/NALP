/**
 * zoneAWaterfall.ts — Waterfall Zone A الموحد
 * OPEX / LandCut / Shares مفصولة كبنود
 * سياسة التعادل A: الفترة تُحكم من cumulative قبل إضافة أرباحها
 */

import { ZONE_A_YEARLY_MODEL } from "@/lib/financialCanon";

export interface ZoneAWaterfallInput {
  carsPerDay: number;
  avgCommissionPerCar: number;
  daysPerYear: number;
  isPreBreakeven: boolean;
}

export interface ZoneAWaterfallOutput {
  grossRevenue: number;
  landCut100: number;
  operatingIncome: number;
  opex: number;
  profitAfterOpex: number;
  landOwnerShare50: number;
  operatorProfit: number;
}

export function calcZoneAWaterfall(input: ZoneAWaterfallInput): ZoneAWaterfallOutput {
  const opexCap = ZONE_A_YEARLY_MODEL.opexCapPercent / 100;
  const landCutPerCar = ZONE_A_YEARLY_MODEL.landOwnerCutPerCarPreBreakeven;
  const landOwnerPostShare = ZONE_A_YEARLY_MODEL.landOwnerPostBreakevenSharePercent / 100;

  const { carsPerDay, avgCommissionPerCar, daysPerYear, isPreBreakeven } = input;

  const grossRevenue = carsPerDay * avgCommissionPerCar * daysPerYear;

  const annualCars = carsPerDay * daysPerYear;
  const landCut100 = isPreBreakeven ? annualCars * landCutPerCar : 0;

  const operatingIncome = grossRevenue - landCut100;

  const opex = operatingIncome * opexCap;
  const profitAfterOpex = operatingIncome - opex;

  const landOwnerShare50 = isPreBreakeven ? 0 : profitAfterOpex * landOwnerPostShare;

  const operatorProfit = profitAfterOpex - landOwnerShare50;

  return {
    grossRevenue,
    landCut100,
    operatingIncome,
    opex,
    profitAfterOpex,
    landOwnerShare50,
    operatorProfit,
  };
}
