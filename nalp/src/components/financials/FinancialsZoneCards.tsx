"use client";

import { Card } from "@/components/ui/Card";
import { formatSAR } from "@/lib/formatNumber";
import {
  REQUIRED_CAPITAL,
  ZONE_OPERATIONAL,
  type ZoneId,
} from "@/lib/financialCanon";
import { getCompanyAnnual } from "@/lib/calculators/returnsEngine";

const ZONE_IDS: ZoneId[] = ["A", "B", "C", "D"];

const DEAL_MODEL: Record<ZoneId, string> = {
  A: "Profit Share — up to 50% (proportional to funding)",
  B: "Profit Share — up to 50% (proportional to funding)",
  C: "Profit Share — up to 50% (proportional to funding)",
  D: "Waterfall — 90% pre-breakeven, 50% post-breakeven",
};

export function FinancialsZoneCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ZONE_IDS.map((zoneId) => {
        const company = getCompanyAnnual(zoneId);
        const zone = ZONE_OPERATIONAL[zoneId];
        const required = REQUIRED_CAPITAL[zoneId];
        const dealModel = DEAL_MODEL[zoneId];

        return (
          <Card
            key={zoneId}
            className="flex min-h-[220px] flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <h3 className="text-lg font-semibold text-slate-900">{zone.name}</h3>
            <div className="mt-4 flex flex-1 flex-col gap-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500">الإيراد السنوي (Company Revenue)</span>
                <span className="font-medium text-slate-900">
                  {formatSAR(company.revenue)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500">صافي الربح السنوي (Company Net)</span>
                <span className="font-medium text-emerald-700">
                  {formatSAR(company.netProfit)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500">رأس المال المطلوب</span>
                <span className="font-bold text-indigo-600">
                  {formatSAR(required)}
                </span>
              </div>
              <div className="mt-auto flex flex-col gap-1 border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-500">نموذج الصفقة</span>
                <span className="text-xs font-medium text-slate-700">
                  {dealModel}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
