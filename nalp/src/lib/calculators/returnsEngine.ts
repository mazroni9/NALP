/**
 * returnsEngine.ts — محرك حسابات العوائد المركزي
 * Zones A/B/C: نموذج مشاركة أرباح 50% عند تمويل 100% من المطلوب
 * Zone D: Waterfall — قبل التعادل 90% للمستثمر، بعده 50%
 */

import {
  ZONE_OPERATIONAL,
  ZONE_D,
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
