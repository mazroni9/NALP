/**
 * returnsEngine.ts — محرك حسابات العوائد المركزي
 * Zones A/B/C: نموذج مشاركة أرباح 50% عند تمويل 100% من المطلوب
 * Zone D: Waterfall — قبل التعادل 90% للمستثمر، بعده 50%
 */

import {
  ZONE_OPERATIONAL,
  ZONE_D,
  ZONE_A_YEARLY_MODEL,
  REQUIRED_CAPITAL,
  type ZoneId,
} from "@/lib/financialCanon";

export type { ZoneId };

export interface CompanyAnnual {
  revenue: number;
  opex: number;
  netProfit: number;
}

export function getCompanyAnnual(zoneId: ZoneId): CompanyAnnual {
  const z = ZONE_OPERATIONAL[zoneId];
  if (zoneId === "A") {
    let sumRevenue = 0;
    let sumNet = 0;
    for (let y = 0; y < 10; y++) {
      const cars = ZONE_A_YEARLY_MODEL.carsPerDay[y];
      const avg = ZONE_A_YEARLY_MODEL.avgCommissionPerCar[y];
      const grossRevenue =
        cars * avg * ZONE_A_YEARLY_MODEL.daysPerYear;
      const landCutYear1 =
        y === 0
          ? cars *
            ZONE_A_YEARLY_MODEL.landOwnerCutPerCarYear1 *
            ZONE_A_YEARLY_MODEL.daysPerYear
          : 0;
      const operatingIncome = grossRevenue - landCutYear1;
      const opex =
        operatingIncome *
        (ZONE_A_YEARLY_MODEL.opexCapPercent / 100);
      const profitAfterOpex = operatingIncome - opex;
      sumRevenue += grossRevenue;
      sumNet += profitAfterOpex;
    }
    const avgRevenue = sumRevenue / 10;
    const avgNet = sumNet / 10;
    return {
      revenue: Math.round(avgRevenue),
      opex: Math.round(avgRevenue - avgNet),
      netProfit: Math.round(avgNet),
    };
  }
  const revenue = z.annualRevenue;
  const netProfit = z.netAnnual;
  const opex = revenue - netProfit;
  return { revenue, opex, netProfit };
}

export interface InvestorAnnualResult {
  investorProfit: number;
  sharePre?: number;
  sharePost?: number;
  breakevenMonths?: number;
}

export function getInvestorAnnual(
  zoneId: ZoneId,
  investmentAmount: number
): InvestorAnnualResult {
  const sanitized = Math.max(0, investmentAmount);
  const required = REQUIRED_CAPITAL[zoneId];
  const fundingRatio = required > 0 ? Math.min(sanitized / required, 1) : 0;
  const companyNet = ZONE_OPERATIONAL[zoneId].netAnnual;

  if (zoneId === "D") {
    const sharePre = ZONE_D.investorSharePre;
    const sharePost = ZONE_D.investorSharePost;
    return {
      investorProfit: companyNet * sharePre,
      sharePre,
      sharePost,
      breakevenMonths: ZONE_D.breakevenMonths,
    };
  }

  const investorShare = 0.5 * fundingRatio;
  const investorProfit = companyNet * investorShare;
  return { investorProfit };
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

export function buildProjection(
  zoneId: ZoneId,
  investmentAmount: number,
  years = 10
): BuildProjectionResult {
  const sanitized = Math.max(0, investmentAmount);
  const required = REQUIRED_CAPITAL[zoneId];
  const fundingRatio = required > 0 ? Math.min(sanitized / required, 1) : 0;

  const z = ZONE_OPERATIONAL[zoneId];
  const companyRevenue = z.annualRevenue;
  const companyNet = z.netAnnual;
  const companyOpex = companyRevenue - companyNet;

  let cumulativeInvestorProfit = 0;
  let breakEvenYear = -1;
  const projections: ProjectionRow[] = [];

  if (zoneId === "D") {
    const sharePre = ZONE_D.investorSharePre;
    const sharePost = ZONE_D.investorSharePost;

    for (let y = 1; y <= years; y++) {
      let investorProfit: number;
      if (cumulativeInvestorProfit < sanitized) {
        investorProfit = companyNet * sharePre;
      } else {
        investorProfit = companyNet * sharePost;
      }
      cumulativeInvestorProfit += investorProfit;
      if (breakEvenYear === -1 && cumulativeInvestorProfit >= sanitized) {
        breakEvenYear = y;
      }
      projections.push({
        year: y,
        companyRevenue,
        companyNetProfit: companyNet,
        companyOpex,
        investorProfit,
        cumulativeInvestorProfit,
      });
    }

    return {
      projections,
      breakEvenYear,
      breakEvenMonthsLabel: `بعد ${ZONE_D.breakevenMonths} شهر تقريبًا`,
    };
  }

  if (zoneId === "A") {
    const reqA = REQUIRED_CAPITAL["A"];
    const fundingRatio =
      reqA > 0 ? Math.min(sanitized / reqA, 1) : 0;
    const investorShare = 0.5 * fundingRatio;

    for (let y = 1; y <= years; y++) {
      const idx = y - 1;
      const cars =
        ZONE_A_YEARLY_MODEL.carsPerDay[
          Math.min(idx, ZONE_A_YEARLY_MODEL.carsPerDay.length - 1)
        ];
      const avg =
        ZONE_A_YEARLY_MODEL.avgCommissionPerCar[
          Math.min(idx, ZONE_A_YEARLY_MODEL.avgCommissionPerCar.length - 1)
        ];
      const grossRevenue =
        cars * avg * ZONE_A_YEARLY_MODEL.daysPerYear;
      const landCutYear1 =
        y === 1
          ? cars *
            ZONE_A_YEARLY_MODEL.landOwnerCutPerCarYear1 *
            ZONE_A_YEARLY_MODEL.daysPerYear
          : 0;
      const operatingIncome = grossRevenue - landCutYear1;
      const opex =
        operatingIncome *
        (ZONE_A_YEARLY_MODEL.opexCapPercent / 100);
      const profitAfterOpex = operatingIncome - opex;
      const landOwnerPostShare =
        cumulativeInvestorProfit >= sanitized
          ? profitAfterOpex *
            (ZONE_A_YEARLY_MODEL.landOwnerPostBreakevenSharePercent / 100)
          : 0;
      const distributableProfit = profitAfterOpex - landOwnerPostShare;
      const investorProfit = distributableProfit * investorShare;

      cumulativeInvestorProfit += investorProfit;
      if (breakEvenYear === -1 && cumulativeInvestorProfit >= sanitized) {
        breakEvenYear = y;
      }
      projections.push({
        year: y,
        companyRevenue: grossRevenue,
        companyNetProfit: distributableProfit,
        companyOpex: opex,
        investorProfit,
        cumulativeInvestorProfit,
      });
    }
    return { projections, breakEvenYear };
  }

  const investorShare = 0.5 * fundingRatio;
  const investorProfitPerYear = companyNet * investorShare;

  for (let y = 1; y <= years; y++) {
    cumulativeInvestorProfit += investorProfitPerYear;
    if (breakEvenYear === -1 && cumulativeInvestorProfit >= sanitized) {
      breakEvenYear = y;
    }
    projections.push({
      year: y,
      companyRevenue,
      companyNetProfit: companyNet,
      companyOpex,
      investorProfit: investorProfitPerYear,
      cumulativeInvestorProfit,
    });
  }

  return { projections, breakEvenYear };
}
