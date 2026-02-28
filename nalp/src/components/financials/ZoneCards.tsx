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
    name: "Zone-D (Workshops - Lease Only)",
    items: [
      { label: "إيجار سنوي صافي", value: 912000 },
      { label: "دخل 8 سنوات", value: 7296000 },
    ],
    risk: "منخفض جدًا",
    riskClass: "bg-emerald-100 text-emerald-700",
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
          className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <h3 className="text-lg font-semibold text-slate-900">{z.name}</h3>
          <dl className="mt-4 space-y-3 text-sm">
            {z.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <dt className="text-slate-500">{item.label}</dt>
                <dd className="font-medium text-slate-900">
                  {formatValue(item.value, "suffix" in item ? item.suffix : undefined)}
                  {"note" in item && item.note && (
                    <span className="mr-1 text-xs text-slate-400">({item.note})</span>
                  )}
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <dt className="text-slate-500">Risk</dt>
              <dd>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${z.riskClass}`}
                >
                  {z.risk}
                </span>
              </dd>
            </div>
          </dl>
        </Card>
      ))}
    </div>
  );
}
