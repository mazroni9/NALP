/**
 * returnsEngine.ts — محرك حسابات العوائد المركزي
 * Zones A/B/C: نموذج مشاركة أرباح 50% عند تمويل 100%
 * Zone D: Waterfall — قبل التعادل 90% للمستثمر، بعده 50%
 */

import {
  ZONE_OPERATIONAL,
  ZONE_D,
  ZONE_A_YEARLY_MODEL,
  REQUIRED_CAPITAL,
  WATERFALL_PREFERRED_RETURN_RATE_DECIMAL,
  WATERFALL_RESIDUAL_SPLIT,
  type ZoneId,
} from "@/lib/financialCanon";
import { calcZoneAWaterfall } from "@/lib/calculators/zoneAWaterfall";
import { computeWaterfall3Layer } from "@/lib/calculators/waterfall";

export type { ZoneId };

export interface CompanyAnnual {
  revenue: number;
  opex: number;
  netProfit: number;
}

export function getCompanyAnnual(zoneId: ZoneId): CompanyAnnual {
  const z = ZONE_OPERATIONAL[zoneId];
  if (zoneId === "A") {
    let sumGross = 0;
    let sumOpex = 0;
    let sumProfitAfterOpex = 0;

    for (let y = 0; y < 10; y++) {
      const carsPerDay = ZONE_A_YEARLY_MODEL.carsPerDay[y];
      const avgCommissionPerCar = ZONE_A_YEARLY_MODEL.avgCommissionPerCar[y];
      const wf = calcZoneAWaterfall({
        carsPerDay,
        avgCommissionPerCar,
        daysPerYear: ZONE_A_YEARLY_MODEL.daysPerYear,
        isPreBreakeven: true,
      });
      sumGross += wf.grossRevenue;
      sumOpex += wf.opex;
      sumProfitAfterOpex += wf.profitAfterOpex;
    }

    const avgGross = sumGross / 10;
    const avgOpex = sumOpex / 10;
    const avgNet = sumProfitAfterOpex / 10;

    return {
      revenue: Math.round(avgGross),
      opex: Math.round(avgOpex),
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
  investorProfitPre?: number;
  investorProfitPost?: number;
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
      investorProfitPre: companyNet * sharePre,
      investorProfitPost: companyNet * sharePost,
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

  grossRevenue: number;
  landCut100: number;
  operatingIncome: number;
  opex: number;
  profitAfterOpex: number;

  landOwnerShare50: number;
  operatorProfit: number;
  investorProfit: number;
  operatorNetAfterInvestor: number;

  cumulativeInvestorProfit: number;

  breakevenStatus: "pre" | "breakeven" | "post";
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
  const z = ZONE_OPERATIONAL[zoneId];
  const companyRevenue = z.annualRevenue;
  const companyNet = z.netAnnual;
  const companyOpex = companyRevenue - companyNet;

  let cumulativeInvestorProfit = 0;
  let breakEvenYear = -1;
  const projections: ProjectionRow[] = [];

  if (zoneId === "B" || zoneId === "C" || zoneId === "D") {
    let cumulativeCapitalReturned = 0;

    for (let y = 1; y <= years; y++) {
      const wf = computeWaterfall3Layer({
        profitAfterOpex: companyNet,
        investmentAmount: sanitized,
        preferredReturnRateDecimal: WATERFALL_PREFERRED_RETURN_RATE_DECIMAL,
        residualSplit: { ...WATERFALL_RESIDUAL_SPLIT },
        cumulativeCapitalReturned,
      });

      const returnOfCapital = wf.steps.find((s) => s.name === "Return of Capital")?.amount ?? 0;
      cumulativeCapitalReturned += returnOfCapital;
      cumulativeInvestorProfit += wf.investorIncome;

      if (breakEvenYear === -1 && cumulativeCapitalReturned >= sanitized) {
        breakEvenYear = y;
      }

      const breakevenStatus: ProjectionRow["breakevenStatus"] =
        breakEvenYear === -1 ? "pre" : y === breakEvenYear ? "breakeven" : y > breakEvenYear ? "post" : "pre";

      projections.push({
        year: y,
        grossRevenue: companyRevenue,
        landCut100: 0,
        operatingIncome: companyRevenue,
        opex: companyOpex,
        profitAfterOpex: companyNet,

        landOwnerShare50: Math.round(wf.landOwnerIncome),
        operatorProfit: Math.round(wf.operatorIncome),
        investorProfit: Math.round(wf.investorIncome),
        operatorNetAfterInvestor: Math.round(wf.operatorIncome),

        cumulativeInvestorProfit: Math.round(cumulativeInvestorProfit),
        breakevenStatus,
      });
    }

    return {
      projections,
      breakEvenYear,
      breakEvenMonthsLabel: zoneId === "D" ? `بعد ${ZONE_D.breakevenMonths} شهر تقريبًا` : undefined,
    };
  }

  if (zoneId === "A") {
    const reqA = REQUIRED_CAPITAL["A"];
    const fr = reqA > 0 ? Math.min(sanitized / reqA, 1) : 0;
    const investorShareOfOperator = 0.5 * fr;

    for (let y = 1; y <= years; y++) {
      const idx = y - 1;
      const carsPerDay =
        ZONE_A_YEARLY_MODEL.carsPerDay[Math.min(idx, ZONE_A_YEARLY_MODEL.carsPerDay.length - 1)];
      const avgCommissionPerCar =
        ZONE_A_YEARLY_MODEL.avgCommissionPerCar[Math.min(idx, ZONE_A_YEARLY_MODEL.avgCommissionPerCar.length - 1)];

      const isPre = cumulativeInvestorProfit < sanitized;

      const wf = calcZoneAWaterfall({
        carsPerDay,
        avgCommissionPerCar,
        daysPerYear: ZONE_A_YEARLY_MODEL.daysPerYear,
        isPreBreakeven: isPre,
      });

      const investorProfit = wf.operatorProfit * investorShareOfOperator;
      const operatorNetAfterInvestor = wf.operatorProfit - investorProfit;

      cumulativeInvestorProfit += investorProfit;

      if (breakEvenYear === -1 && cumulativeInvestorProfit >= sanitized) {
        breakEvenYear = y;
      }

      const breakevenStatus: ProjectionRow["breakevenStatus"] =
        breakEvenYear === -1 ? "pre" : y === breakEvenYear ? "breakeven" : y > breakEvenYear ? "post" : "pre";

      projections.push({
        year: y,
        grossRevenue: Math.round(wf.grossRevenue),
        landCut100: Math.round(wf.landCut100),
        operatingIncome: Math.round(wf.operatingIncome),
        opex: Math.round(wf.opex),
        profitAfterOpex: Math.round(wf.profitAfterOpex),

        landOwnerShare50: Math.round(wf.landOwnerShare50),
        operatorProfit: Math.round(wf.operatorProfit),
        investorProfit: Math.round(investorProfit),
        operatorNetAfterInvestor: Math.round(operatorNetAfterInvestor),

        cumulativeInvestorProfit: Math.round(cumulativeInvestorProfit),
        breakevenStatus,
      });
    }

    return { projections, breakEvenYear };
  }

  return { projections, breakEvenYear: -1 };
}
