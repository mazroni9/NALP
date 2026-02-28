"use client";

import { Card } from "@/components/ui/Card";

const CARDS = [
  {
    label: "إجمالي دخل ملاك الأرض (8 سنوات)",
    value: "61.4M",
    suffix: "SAR",
    note: "تقديري وفق افتراضات التشغيل",
    tooltip: "هذه أرقام تقديرية قابلة للتحديث",
  },
  {
    label: "متوسط دخل سنوي تقديري",
    value: "6.8M",
    suffix: "SAR",
    note: "تقديري وفق افتراضات التشغيل",
    tooltip: "هذه أرقام تقديرية قابلة للتحديث",
  },
  {
    label: "نطاق التقييم بعد 8 سنوات",
    value: "43–48M",
    suffix: "SAR",
    note: "تقديري وفق افتراضات التشغيل",
    tooltip: "هذه أرقام تقديرية قابلة للتحديث",
  },
  {
    label: "عدد مناطق الدخل",
    value: "4",
    suffix: "Zones",
    note: "تقديري وفق افتراضات التشغيل",
    tooltip: "هذه أرقام تقديرية قابلة للتحديث",
  },
];

export function SnapshotCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((c) => (
        <Card
          key={c.label}
          className="group relative transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          title={c.tooltip}
        >
          <p className="text-sm font-medium text-slate-500">{c.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {c.value}{" "}
            <span className="text-base font-normal text-slate-500">{c.suffix}</span>
          </p>
          <p className="mt-2 text-xs text-slate-400">{c.note}</p>
        </Card>
      ))}
    </div>
  );
}
