"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/formatNumber";
import { PROJECT_TOTALS } from "@/lib/projectData";

const REF_CAP_RATE = PROJECT_TOTALS.capRate;
const REF_VALUATION = Math.round(PROJECT_TOTALS.valuationAtExit / 1e6);

export function ValuationSimulator() {
  const [capRate, setCapRate] = useState(PROJECT_TOTALS.capRate);
  const valuation = Math.round(PROJECT_TOTALS.avgAnnualIncome / (capRate / 100));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900">محاكي التقييم</h3>
      <p className="mt-1 text-sm text-slate-500">
        Valuation = Annual Income ÷ Cap Rate
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Cap Rate الحالي</span>
            <span className="font-medium text-slate-900">{capRate}%</span>
          </div>
          <input
            type="range"
            min={8}
            max={12}
            step={0.25}
            value={capRate}
            onChange={(e) => setCapRate(Number(e.target.value))}
            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>8%</span>
            <span>12%</span>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-500">التقييم الناتج</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">
            {formatNumber(valuation)} SAR
          </p>
        </div>

        <p className="text-sm text-slate-500">
          نطاق مرجعي: عند {REF_CAP_RATE}% ≈ {formatNumber(REF_VALUATION)}M SAR
        </p>
      </div>
    </Card>
  );
}
