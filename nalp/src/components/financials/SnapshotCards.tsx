"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { formatNumber, formatSAR } from "@/lib/formatNumber";
import { computeProjectTotalsFromEngine } from "@/lib/calculators/projectTotalsEngine";

export function SnapshotCards() {
  const totals = useMemo(() => computeProjectTotalsFromEngine({ years: 8 }), []);

  const cards = [
    {
      label: "إجمالي دخل 8 سنوات (Owner Total 8Y)",
      value: formatSAR(totals.ownerTotalIncome8Years),
      suffix: "",
      note: "تقديري وفق افتراضات التشغيل",
      tooltip: "هذه أرقام تقديرية قابلة للتحديث",
    },
    {
      label: "متوسط الدخل السنوي",
      value: formatSAR(totals.avgAnnualIncome),
      suffix: "",
      note: "تقديري وفق افتراضات التشغيل",
      tooltip: "هذه أرقام تقديرية قابلة للتحديث",
    },
    {
      label: "التقييم المتوقع (Valuation at Exit)",
      value: formatSAR(totals.valuationAtExit),
      suffix: "",
      note: "تقديري وفق افتراضات التشغيل",
      tooltip: "هذه أرقام تقديرية قابلة للتحديث",
    },
    {
      label: "عدد المناطق",
      value: formatNumber(totals.zonesCount, { maximumFractionDigits: 0 }),
      suffix: "Zones",
      note: "تقديري وفق افتراضات التشغيل",
      tooltip: "هذه أرقام تقديرية قابلة للتحديث",
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
