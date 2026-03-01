"use client";

import { Card } from "@/components/ui/Card";
import { formatNumber, formatSAR } from "@/lib/formatNumber";
import { ZONE_A, ZONE_B, ZONE_C, ZONE_D } from "@/lib/projectData";

function formatValue(value: number | string, suffix?: string): string {
  if (typeof value === "number") {
    return suffix ? `${formatNumber(value)} SAR${suffix}` : formatSAR(value);
  }
  return value;
}

const ZONES = [
  {
    id: "zone-a",
    name: ZONE_A.name,
    items: [
      { label: "إيراد 8 سنوات (قبل المصاريف)", value: ZONE_A.revenue8Years },
      { label: "OPEX مفترض", value: `${ZONE_A.opexPercent}%` },
      { label: "دخل ملاك الأرض (8 سنوات)", value: ZONE_A.ownerIncome8Years },
    ],
    risk: ZONE_A.risk,
    riskClass: "bg-amber-100 text-amber-700",
  },
  {
    id: "zone-b",
    name: ZONE_B.name,
    items: [
      { label: "إيراد سنوي", value: ZONE_B.annualRevenue },
      { label: "OPEX تقديري", value: ZONE_B.opexFixed, suffix: "/yr" as const },
      { label: "دخل ملاك الأرض (8 سنوات)", value: ZONE_B.ownerIncome8Years },
    ],
    risk: ZONE_B.risk,
    riskClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "zone-c",
    name: ZONE_C.name,
    items: [
      { label: "إيراد سنوي", value: ZONE_C.annualRevenue },
      { label: "OPEX", value: `${ZONE_C.opexPercent}%` },
      { label: "CAPEX تقديري", value: ZONE_C.capex },
      { label: "دخل ملاك الأرض (8 سنوات)", value: ZONE_C.ownerIncome8Years, note: "تقريبي" },
    ],
    risk: ZONE_C.risk,
    riskClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "zone-d",
    name: ZONE_D.name,
    items: [
      { label: "نموذج الإيراد", value: ZONE_D.model },
      { label: "تكلفة الإنشاء على المستثمر", value: ZONE_D.constructionCost },
      { label: "إيراد سنوي", value: ZONE_D.annualRevenue },
      { label: "OPEX", value: `${ZONE_D.opexPercent}%` },
      { label: "دخل مالك الأرض 8 سنوات", value: ZONE_D.ownerIncome8Years },
    ],
    risk: ZONE_D.risk,
    riskClass: "bg-amber-100 text-amber-700",
    note: "المصاريف الإدارية محدودة بـ 10% من الإيراد ولا تُدرج ضمن OPEX حماية لحصة مالك الأرض.",
  },
];

export function ZoneCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ZONES.map((z) => (
        <Card
          key={z.id}
          className="flex min-h-[240px] flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <h3 className="text-lg font-semibold text-slate-900">{z.name}</h3>
          <div className="mt-4 flex flex-1 flex-col text-sm">
            <div className="space-y-3">
              {z.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-medium text-slate-900">
                    {formatValue(item.value, "suffix" in item ? item.suffix : undefined)}
                    {"note" in item && item.note && (
                      <span className="mr-1 text-xs text-slate-400">({item.note})</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            {"note" in z && z.note && (
              <p className="mt-2 text-xs text-slate-400">{z.note}</p>
            )}
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-slate-500">مستوى المخاطرة</span>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${z.riskClass}`}
              >
                {z.risk}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
