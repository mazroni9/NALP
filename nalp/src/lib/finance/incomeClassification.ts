/**
 * Income classification by economic nature — for investor-facing display.
 * Separates: real-estate income, operating income, service income, owner economics.
 */

import type { ZoneId } from "@/lib/financialCanon";
import type { ProjectTotalsEngineResult } from "@/lib/calculators/projectTotalsEngine";

export type IncomeTypeId = "realEstate" | "operating" | "service" | "ownerEconomics";

export const INCOME_TYPE_LABELS: Record<IncomeTypeId, string> = {
  realEstate: "دخل عقاري",
  operating: "دخل تشغيلي",
  service: "دخل خدمات",
  ownerEconomics: "اقتصاديات المالك",
};

/** Primary income type per zone for aggregation (one type per zone to avoid double count). */
export const ZONE_PRIMARY_INCOME_TYPE: Record<ZoneId, IncomeTypeId> = {
  A: "service",
  B: "realEstate",
  C: "realEstate",
  D: "service",
};

/** All income types each zone touches (for display labels). */
export const ZONE_TO_INCOME_TYPES: Record<ZoneId, IncomeTypeId[]> = {
  A: ["service", "operating", "ownerEconomics"],
  B: ["realEstate", "operating", "ownerEconomics"],
  C: ["realEstate", "operating", "ownerEconomics"],
  D: ["service", "operating", "ownerEconomics"],
};

export interface IncomeByZoneRow {
  zoneId: ZoneId;
  zoneName: string;
  ownerIncome8Years: number;
  avgAnnual: number;
  incomeTypes: IncomeTypeId[];
}

export interface IncomeByTypeRow {
  typeId: IncomeTypeId;
  label: string;
  ownerIncome8Years: number;
  avgAnnual: number;
  zones: ZoneId[];
}

export interface GrossNetRow {
  zoneId: ZoneId;
  grossLabel: string;
  netLabel: string;
  /** إذا لم يكن متوفراً من المحرك نتركه للمكوّن أن يملأه من ZONE_OPERATIONAL */
  gross?: number;
  net?: number;
}

/**
 * Builds "income by zone" from engine result (perZone + zone names from caller).
 */
const EMPTY_PER_ZONE: Record<ZoneId, { ownerIncome8Years: number; avgAnnual: number }> = {
  A: { ownerIncome8Years: 0, avgAnnual: 0 },
  B: { ownerIncome8Years: 0, avgAnnual: 0 },
  C: { ownerIncome8Years: 0, avgAnnual: 0 },
  D: { ownerIncome8Years: 0, avgAnnual: 0 },
};

export function getIncomeByZone(
  result: ProjectTotalsEngineResult,
  zoneNames: Record<ZoneId, string>
): IncomeByZoneRow[] {
  const perZone = result.perZone ?? EMPTY_PER_ZONE;
  return (["A", "B", "C", "D"] as ZoneId[]).map((zoneId) => ({
    zoneId,
    zoneName: zoneNames[zoneId] ?? `المنطقة ${zoneId}`,
    ownerIncome8Years: perZone[zoneId]?.ownerIncome8Years ?? 0,
    avgAnnual: perZone[zoneId]?.avgAnnual ?? 0,
    incomeTypes: ZONE_TO_INCOME_TYPES[zoneId] ?? [],
  }));
}

/**
 * Aggregates owner income by economic type using primary type per zone (no double count).
 * realEstate = B+C, service = A+D, ownerEconomics = project total.
 */
export function getIncomeByType(
  result: ProjectTotalsEngineResult,
  zoneNames: Record<ZoneId, string>
): IncomeByTypeRow[] {
  const byZone = getIncomeByZone(result, zoneNames);
  const typeIds: IncomeTypeId[] = ["realEstate", "operating", "service", "ownerEconomics"];

  return typeIds.map((typeId) => {
    if (typeId === "ownerEconomics") {
      return {
        typeId,
        label: INCOME_TYPE_LABELS[typeId],
        ownerIncome8Years: result.ownerTotalIncome8Years,
        avgAnnual: result.avgAnnualIncome,
        zones: ["A", "B", "C", "D"] as ZoneId[],
      };
    }
    const rows = byZone.filter((r) => ZONE_PRIMARY_INCOME_TYPE[r.zoneId] === typeId);
    const ownerIncome8Years = rows.reduce((s, r) => s + r.ownerIncome8Years, 0);
    const avgAnnual = rows.reduce((s, r) => s + r.avgAnnual, 0);
    return {
      typeId,
      label: INCOME_TYPE_LABELS[typeId],
      ownerIncome8Years,
      avgAnnual,
      zones: rows.map((r) => r.zoneId),
    };
  });
}
