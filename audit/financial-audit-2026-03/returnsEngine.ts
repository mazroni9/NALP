/**
 * returnsEngine.ts — محرك حسابات العوائد المركزي
 * نسخة تدقيق: 2026-03
 */

import {
  ZONE_OPERATIONAL,
  ZONE_D,
  ZONE_A_YEARLY_MODEL,
  REQUIRED_CAPITAL,
  type ZoneId,
} from "./financialCanon";

export type { ZoneId };

export interface CompanyAnnual {
  revenue: number;
  opex: number;
  netProfit: number;
}

export function getCompanyAnnual(zoneId: ZoneId): CompanyAnnual {
  const z = ZONE_OPERATIONAL[zoneId];
  if (zoneId === "A") {
    let sumRevenue = 0, sumNet = 0;
    for (let y = 0; y < 10; y++) {
      const cars = ZONE_A_YEARLY_MODEL.carsPerDay[y];
      const avg = ZONE_A_YEARLY_MODEL.avgCommissionPerCar[y];
      const grossRevenue = cars * avg * ZONE_A_YEARLY_MODEL.daysPerYear;
      const landCutYear1 = y === 0 ? cars * ZONE_A_YEARLY_MODEL.landOwnerCutPerCarPreBreakeven * ZONE_A_YEARLY_MODEL.daysPerYear : 0;
      const operatingIncome = grossRevenue - landCutYear1;
      const opex = operatingIncome * (ZONE_A_YEARLY_MODEL.opexCapPercent / 100);
      sumRevenue += grossRevenue;
      sumNet += operatingIncome - opex;
    }
    return {
      revenue: Math.round(sumRevenue / 10),
      opex: Math.round(sumRevenue / 10 - sumNet / 10),
      netProfit: Math.round(sumNet / 10),
    };
  }
  const revenue = z.annualRevenue, netProfit = z.netAnnual;
  return { revenue, opex: revenue - netProfit, netProfit };
}

export interface ProjectionRow {
  year: number;
  companyRevenue: number;
  companyNetProfit: number;
  companyOpex: number;
  investorProfit: number;
  cumulativeInvestorProfit: number;
}

export interface BuildProjectionResult {
  projections: ProjectionRow[];
  breakEvenYear: number;
  breakEvenMonthsLabel?: string;
}

export function buildProjection(zoneId: ZoneId, investmentAmount: number, years = 10): BuildProjectionResult {
  const sanitized = Math.max(0, investmentAmount);
  const required = REQUIRED_CAPITAL[zoneId];
  const fundingRatio = required > 0 ? Math.min(sanitized / required, 1) : 0;
  const z = ZONE_OPERATIONAL[zoneId];
  const companyRevenue = z.annualRevenue, companyNet = z.netAnnual, companyOpex = companyRevenue - companyNet;
  let cumulativeInvestorProfit = 0, breakEvenYear = -1;
  const projections: ProjectionRow[] = [];

  if (zoneId === "D") {
    const sharePre = ZONE_D.investorSharePre, sharePost = ZONE_D.investorSharePost;
    for (let y = 1; y <= years; y++) {
      const investorProfit = cumulativeInvestorProfit < sanitized ? companyNet * sharePre : companyNet * sharePost;
      cumulativeInvestorProfit += investorProfit;
      if (breakEvenYear === -1 && cumulativeInvestorProfit >= sanitized) breakEvenYear = y;
      projections.push({ year: y, companyRevenue, companyNetProfit: companyNet, companyOpex, investorProfit, cumulativeInvestorProfit });
    }
    return { projections, breakEvenYear, breakEvenMonthsLabel: `بعد ${ZONE_D.breakevenMonths} شهر تقريبًا` };
  }

  if (zoneId === "A") {
    const reqA = REQUIRED_CAPITAL["A"];
    const fundingRatioA = reqA > 0 ? Math.min(sanitized / reqA, 1) : 0;
    const investorShare = 0.5 * fundingRatioA;
    for (let y = 1; y <= years; y++) {
      const idx = Math.min(y - 1, 9);
      const cars = ZONE_A_YEARLY_MODEL.carsPerDay[idx];
      const avg = ZONE_A_YEARLY_MODEL.avgCommissionPerCar[idx];
      const grossRevenue = cars * avg * ZONE_A_YEARLY_MODEL.daysPerYear;
      const landCutYear1 = y === 1 ? cars * ZONE_A_YEARLY_MODEL.landOwnerCutPerCarPreBreakeven * ZONE_A_YEARLY_MODEL.daysPerYear : 0;
      const operatingIncome = grossRevenue - landCutYear1;
      const opex = operatingIncome * (ZONE_A_YEARLY_MODEL.opexCapPercent / 100);
      const profitAfterOpex = operatingIncome - opex;
      const landOwnerPostShare = cumulativeInvestorProfit >= sanitized ? profitAfterOpex * (ZONE_A_YEARLY_MODEL.landOwnerPostBreakevenSharePercent / 100) : 0;
      const distributableProfit = profitAfterOpex - landOwnerPostShare;
      const investorProfit = distributableProfit * investorShare;
      cumulativeInvestorProfit += investorProfit;
      if (breakEvenYear === -1 && cumulativeInvestorProfit >= sanitized) breakEvenYear = y;
      projections.push({ year: y, companyRevenue: grossRevenue, companyNetProfit: distributableProfit, companyOpex, investorProfit, cumulativeInvestorProfit });
    }
    return { projections, breakEvenYear };
  }

  const investorShare = 0.5 * fundingRatio;
  const investorProfitPerYear = companyNet * investorShare;
  for (let y = 1; y <= years; y++) {
    cumulativeInvestorProfit += investorProfitPerYear;
    if (breakEvenYear === -1 && cumulativeInvestorProfit >= sanitized) breakEvenYear = y;
    projections.push({ year: y, companyRevenue, companyNetProfit: companyNet, companyOpex, investorProfit: investorProfitPerYear, cumulativeInvestorProfit });
  }
  return { projections, breakEvenYear };
}
