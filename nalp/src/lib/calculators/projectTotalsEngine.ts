/**
 * projectTotalsEngine.ts — إخراج Totals (حصة ملاك الأرض فقط) من المحرك
 * بدل ZONE_*_RAW، مع إبقاء RAW كـ brochure/legacy.
 */

import { CAP_RATE, REQUIRED_CAPITAL, type ZoneId } from "@/lib/financialCanon";
import { buildProjection } from "@/lib/calculators/returnsEngine";

export type ProjectTotalsMode = "operationalBaseline" | "noInvestor";

export const PROJECT_TOTALS_DEFAULT_MODE: ProjectTotalsMode =
  "operationalBaseline";

export interface ProjectTotalsEngineResult {
  ownerTotalIncome8Years: number; // تعريف (A): حصة ملاك الأرض فقط
  avgAnnualIncome: number; // متوسط سنوي لحصة الملاك
  valuationAtExit: number; // avgAnnualIncome / CAP_RATE
  capRate: number; // نسبة مئوية (9)
  capRateDecimal: number;
  zonesCount: number;
  partnershipYears: number;

  perZone?: Record<ZoneId, { ownerIncome8Years: number; avgAnnual: number }>;
}

/**
 * Owner income (A): حصة ملاك الأرض فقط
 * - Zone A: landCut100 (pre) + landOwnerShare50 (post) على مدى السنوات
 * - Zones B/C/D: مؤقتًا owner = profitAfterOpex (صافي تشغيلي) — حتى يُعرَّف waterfall مالك/مشغل
 *
 * mode:
 * - "operationalBaseline" (الافتراضي): يفترض تمويل رأس المال المطلوب بالكامل (REQUIRED_CAPITAL)
 * - "noInvestor": يحسب القدرة التشغيلية بدون مستثمر (investmentAmount = 0)
 */
export function computeProjectTotalsFromEngine(options?: {
  years?: number; // default 8
  mode?: ProjectTotalsMode;
}): ProjectTotalsEngineResult {
  const years = options?.years ?? 8;
  const mode = options?.mode ?? PROJECT_TOTALS_DEFAULT_MODE;
  const zones: ZoneId[] = ["A", "B", "C", "D"];

  const perZone: Record<ZoneId, { ownerIncome8Years: number; avgAnnual: number }> = {
    A: { ownerIncome8Years: 0, avgAnnual: 0 },
    B: { ownerIncome8Years: 0, avgAnnual: 0 },
    C: { ownerIncome8Years: 0, avgAnnual: 0 },
    D: { ownerIncome8Years: 0, avgAnnual: 0 },
  };

  for (const z of zones) {
    const investmentAmount =
      mode === "operationalBaseline" ? REQUIRED_CAPITAL[z] : 0;

    const { projections } = buildProjection(z, investmentAmount, years);
    const slice = projections.slice(0, years);

    if (z === "A") {
      const ownerIncome = slice.reduce(
        (s, r) => s + (r.landCut100 ?? 0) + (r.landOwnerShare50 ?? 0),
        0
      );
      perZone.A.ownerIncome8Years = Math.round(ownerIncome);
      perZone.A.avgAnnual = Math.round(ownerIncome / years);
      continue;
    }

    // B/C/D: owner = land owner share from 3-layer waterfall (engine-derived)
    const ownerIncome = slice.reduce(
      (s, r) => s + (r.landOwnerShare50 ?? 0),
      0
    );
    perZone[z].ownerIncome8Years = Math.round(ownerIncome);
    perZone[z].avgAnnual = Math.round(ownerIncome / years);
  }

  const ownerTotalIncome8Years =
    perZone.A.ownerIncome8Years +
    perZone.B.ownerIncome8Years +
    perZone.C.ownerIncome8Years +
    perZone.D.ownerIncome8Years;

  const avgAnnualIncome = Math.round(ownerTotalIncome8Years / years);
  const valuationAtExit = Math.round(avgAnnualIncome / CAP_RATE);

  return {
    ownerTotalIncome8Years: Math.round(ownerTotalIncome8Years),
    avgAnnualIncome,
    valuationAtExit,
    capRate: Math.round(CAP_RATE * 100),
    capRateDecimal: CAP_RATE,
    zonesCount: 4,
    partnershipYears: 10,
    perZone,
  };
}

/**
 * دخل ملاك الأرض (إجمالي المشروع) لكل سنة — من المحرك فقط.
 */
export function getProjectOwnerIncomeByYear(
  options?: { years?: number; mode?: ProjectTotalsMode }
): number[] {
  const years = options?.years ?? 8;
  const mode = options?.mode ?? PROJECT_TOTALS_DEFAULT_MODE;
  const zones: ZoneId[] = ["A", "B", "C", "D"];
  const byYear: number[] = Array.from({ length: years }, () => 0);

  for (const z of zones) {
    const investmentAmount =
      mode === "operationalBaseline" ? REQUIRED_CAPITAL[z] : 0;
    const { projections } = buildProjection(z, investmentAmount, years);
    const slice = projections.slice(0, years);
    slice.forEach((r, i) => {
      const owner =
        z === "A"
          ? (r.landCut100 ?? 0) + (r.landOwnerShare50 ?? 0)
          : (r.landOwnerShare50 ?? 0);
      byYear[i] += owner;
    });
  }
  return byYear.map((v) => Math.round(v));
}
