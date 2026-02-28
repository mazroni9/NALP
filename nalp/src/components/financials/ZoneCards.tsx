"use client";

import { Card } from "@/components/ui/Card";

const ZONES = [
  {
    id: "zone-a",
    name: "Zone-A (Auction)",
    items: [
      { label: "إيراد 8 سنوات (قبل المصاريف)", value: 33397500 },
      { label: "OPEX مفترض", value: "30%" },
      { label: "دخل ملاك الأرض (8 سنوات)", value: 11689125 },
    ],
    risk: "متوسط",
    riskClass: "bg-amber-100 text-amber-700",
  },
  {
    id: "zone-b",
    name: "Zone-B (Parking)",
    items: [
      { label: "إيراد سنوي", value: 2299500 },
      { label: "OPEX تقديري", value: 100000, suffix: "/yr" as const },
      { label: "دخل ملاك الأرض (8 سنوات)", value: 8798000 },
    ],
    risk: "منخفض",
    riskClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "zone-c",
    name: "Zone-C (Residential)",
    items: [
      { label: "إيراد سنوي", value: 2518560 },
      { label: "OPEX", value: "10%" },
      { label: "CAPEX تقديري", value: 5171600 },
      { label: "دخل ملاك الأرض (8 سنوات)", value: 6800000, note: "تقريبي" },
    ],
    risk: "منخفض–متوسط",
    riskClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "zone-d",
    name: "Zone-D (مركز الخدمات المتكاملة — شراكة استثمارية)",
    items: [
      { label: "نموذج الإيراد", value: "شراكة استثمارية" },
      { label: "تكلفة الإنشاء على المستثمر", value: 2500000 },
      { label: "إيراد Zone-D السنوي الإجمالي", value: 8100000 },
      { label: "OPEX", value: "15%" },
      { label: "صافي الإيراد السنوي", value: 6885000 },
      { label: "دخل مالك الأرض قبل التعادل (10%)", value: 688500, suffix: "/سنة" as const },
      { label: "دخل مالك الأرض بعد التعادل (50%) × 9.7 سنة", value: 33392250, note: "تقريبي" },
      { label: "إجمالي دخل مالك الأرض خلال 10 سنوات", value: 34080750, note: "تقريبي" },
    ],
    risk: "متوسط — شراكة استثمارية",
    riskClass: "bg-amber-100 text-amber-700",
  },
];

function formatValue(value: number | string, suffix?: string): string {
  if (typeof value === "number") {
    return `${value.toLocaleString("en-US")} SAR${suffix ?? ""}`;
  }
  return value;
}

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
