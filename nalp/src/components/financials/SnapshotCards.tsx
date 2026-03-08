"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { formatNumber, formatSAR } from "@/lib/formatNumber";
import { computeProjectTotalsFromEngine } from "@/lib/calculators/projectTotalsEngine";

export function SnapshotCards() {
  const totals = useMemo(() => computeProjectTotalsFromEngine({ years: 8 }), []);

  const cards = [
    {
      label: "دخل الملاك — 8 سنوات",
      value: formatSAR(totals.ownerTotalIncome8Years),
      suffix: "",
      note: "تقدير من النموذج",
      tooltip: "تقديري وفق افتراضات التشغيل",
    },
    {
      label: "متوسط الدخل السنوي",
      value: formatSAR(totals.avgAnnualIncome),
      suffix: "",
      note: "تقدير من النموذج",
      tooltip: "تقديري وفق افتراضات التشغيل",
    },
    {
      label: "التقييم عند الخروج (تقدير)",
      value: formatSAR(totals.valuationAtExit),
      suffix: "",
      note: "تقدير من النموذج",
      tooltip: "تقديري وفق افتراضات التشغيل",
    },
    {
      label: "عدد المناطق",
      value: formatNumber(totals.zonesCount, { maximumFractionDigits: 0 }),
      suffix: "Zones",
      note: "ثابت",
      tooltip: "عدد المناطق الاستثمارية",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="group relative transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          title={c.tooltip}
        >
          <p className="text-sm font-medium text-slate-500">{c.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {c.value}
            {c.suffix && (
              <span className="mr-1 text-base font-normal text-slate-500">{c.suffix}</span>
            )}
          </p>
          <p className="mt-2 text-xs text-slate-400">{c.note}</p>
        </Card>
      ))}
    </div>
  );
}
