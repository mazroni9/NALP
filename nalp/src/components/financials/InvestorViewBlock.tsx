"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { formatNumber, formatSAR, parseNumber } from "@/lib/formatNumber";
import { REQUIRED_CAPITAL, type ZoneId } from "@/lib/financialCanon";
import { buildProjection } from "@/lib/calculators/returnsEngine";

const ZONE_IDS: ZoneId[] = ["A", "B", "C", "D"];

export function InvestorViewBlock() {
  const [selectedZone, setSelectedZone] = useState<ZoneId>("A");
  const [investmentAmount, setInvestmentAmount] = useState<number>(
    REQUIRED_CAPITAL.A
  );

  useEffect(() => {
    setInvestmentAmount(REQUIRED_CAPITAL[selectedZone]);
  }, [selectedZone]);

  const required = REQUIRED_CAPITAL[selectedZone];
  const safeInvestment = Math.max(0, investmentAmount);
  const fundingRatio =
    required > 0 ? Math.min(safeInvestment / required, 1) : 0;
  const investorSharePercent =
    selectedZone === "D" ? null : 0.5 * fundingRatio * 100;

  const { projections, breakEvenYear, breakEvenMonthsLabel } = buildProjection(
    selectedZone,
    investmentAmount,
    10
  );

  const displayBreakEven =
    selectedZone === "D" && breakEvenMonthsLabel
      ? breakEvenMonthsLabel
      : breakEvenYear !== -1
        ? `السنة ${breakEvenYear}`
        : "تتجاوز 10 سنوات";

  const lastRow = projections[9];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Investor View
      </h2>

      {/* Zone selection */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-600 mb-2">اختر المنطقة</p>
        <div className="flex flex-wrap gap-2">
          {ZONE_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedZone(id)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                selectedZone === id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Investment amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          مبلغ الاستثمار (ريال)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={formatNumber(investmentAmount)}
            onChange={(e) => {
              const v = parseNumber(e.target.value);
              if (v >= 0) setInvestmentAmount(v);
            }}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => setInvestmentAmount(required)}
            className="text-xs text-indigo-600 hover:text-indigo-800 underline whitespace-nowrap"
          >
            إعادة تعيين للمبلغ المطلوب
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">نسبة التمويل (Funding Ratio)</p>
          <p className="text-lg font-bold text-indigo-600">
            {formatNumber(fundingRatio * 100, { maximumFractionDigits: 1 })}%
          </p>
        </div>
        {investorSharePercent !== null && (
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">حصة المستثمر الفعلية</p>
            <p className="text-lg font-bold text-emerald-600">
              {formatNumber(investorSharePercent, { maximumFractionDigits: 1 })}%
            </p>
          </div>
        )}
        {selectedZone === "D" && (
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">حصة المستثمر</p>
            <p className="text-sm font-medium text-slate-700">
              قبل التعادل 90% — بعده 50%
            </p>
          </div>
        )}
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">نقطة التعادل</p>
          <p className="text-sm font-bold text-emerald-600">{displayBreakEven}</p>
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 sm:col-span-2 lg:col-span-1">
          <p className="text-xs text-indigo-600">إجمالي ربح 10 سنوات</p>
          <p className="text-lg font-bold text-indigo-700">
            {formatSAR(lastRow?.cumulativeInvestorProfit ?? 0)}
          </p>
        </div>
      </div>

      {/* 10-Year Projection Table */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          جدول الإسقاط 10 سنوات
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-700">السنة</th>
                <th className="px-4 py-3 font-bold text-slate-700">
                  صافي ربح الشركة
                </th>
                <th className="px-4 py-3 font-bold text-slate-700">
                  ربح المستثمر السنوي
                </th>
                <th className="px-4 py-3 font-bold text-slate-700">التراكمي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projections.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    سنة {row.year}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatSAR(row.companyNetProfit)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatSAR(row.investorProfit)}
                  </td>
                  <td className="px-4 py-3 font-bold text-indigo-600">
                    {formatSAR(row.cumulativeInvestorProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
