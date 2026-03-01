"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { formatNumber, formatSAR, parseNumber } from "@/lib/formatNumber";
import {
  ZONE_OPERATIONAL,
  REQUIRED_CAPITAL,
  type ZoneId,
} from "@/lib/financialCanon";
import { buildProjection } from "@/lib/calculators/returnsEngine";
import {
  type LedgerState,
  type Batch,
  computeZoneALedgerSummary,
  LEDGER_STORAGE_KEY,
  getDefaultLedgerState,
  generateBatchId,
} from "@/lib/calculators/ledgerEngine";

export default function InvestorsPage() {
  const [selectedZone, setSelectedZone] = useState<ZoneId>("A");
  const [investmentAmount, setInvestmentAmount] = useState<number>(
    REQUIRED_CAPITAL.A
  );

  const [ledgerState, setLedgerState] = useState<LedgerState | null>(null);
  const [ledgerLoaded, setLedgerLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LEDGER_STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as LedgerState;
        setLedgerState(parsed);
        setInvestmentAmount(parsed.investmentAmount);
      } else {
        setLedgerState(
          getDefaultLedgerState(REQUIRED_CAPITAL.A, REQUIRED_CAPITAL.A)
        );
      }
    } catch {
      setLedgerState(
        getDefaultLedgerState(REQUIRED_CAPITAL.A, REQUIRED_CAPITAL.A)
      );
    }
    setLedgerLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedZone !== "A") {
      setInvestmentAmount(REQUIRED_CAPITAL[selectedZone]);
    }
  }, [selectedZone]);

  const saveLedger = useCallback((state: LedgerState | null) => {
    if (!state) return;
    setLedgerState(state);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }
  }, []);

  const updateLedgerInvestment = useCallback(
    (amt: number) => {
      if (ledgerState && selectedZone === "A") {
        const next: LedgerState = {
          ...ledgerState,
          investmentAmount: amt,
          requiredCapital: REQUIRED_CAPITAL.A,
        };
        saveLedger(next);
      }
    },
    [ledgerState, selectedZone, saveLedger]
  );

  const handleInvestmentChange = (amt: number) => {
    setInvestmentAmount(amt);
    updateLedgerInvestment(amt);
  };

  const handleResetLedger = () => {
    const def = getDefaultLedgerState(investmentAmount, REQUIRED_CAPITAL.A);
    def.investmentAmount = investmentAmount;
    saveLedger(def);
  };

  const zoneData = ZONE_OPERATIONAL;
  const currentZone = zoneData[selectedZone];
  const safeInvestment = Math.max(0, investmentAmount);

  const {
    projections,
    breakEvenYear,
    breakEvenMonthsLabel,
  } = buildProjection(selectedZone, investmentAmount, 10);

  const displayBreakEven =
    selectedZone === "D" && breakEvenMonthsLabel
      ? breakEvenMonthsLabel
      : breakEvenYear !== -1
        ? `السنة ${breakEvenYear}`
        : "تتجاوز 10 سنوات";

  const ledgerSummary =
    ledgerState && selectedZone === "A"
      ? computeZoneALedgerSummary(ledgerState)
      : null;

  const hasLedgerData =
    ledgerState &&
    selectedZone === "A" &&
    ledgerState.months.some((m) => m.batches.length > 0);

  const [mainTab, setMainTab] = useState<"calc" | "ledger" | "budget">("calc");
  const [activeTab, setActiveTab] = useState<"company" | "investor">("company");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    if (selectedZone === "A" && ledgerState && ledgerState.months.length > 0) {
      setSelectedMonth(ledgerState.months[0].month);
    }
  }, [selectedZone, ledgerState]);

  const currentMonthLedger =
    ledgerState?.months.find((m) => m.month === selectedMonth) ?? null;

  const addBatch = () => {
    if (!ledgerState || !currentMonthLedger) return;
    const newBatch: Batch = {
      id: generateBatchId(),
      count: 0,
      commission: 0,
    };
    const nextMonths = ledgerState.months.map((m) =>
      m.month === selectedMonth
        ? { ...m, batches: [...m.batches, newBatch] }
        : m
    );
    saveLedger({
      ...ledgerState,
      months: nextMonths,
    });
  };

  const updateBatch = (
    batchId: string,
    field: "count" | "commission" | "note",
    value: number | string
  ) => {
    if (!ledgerState || !currentMonthLedger) return;
    const nextMonths = ledgerState.months.map((m) => {
      if (m.month !== selectedMonth) return m;
      return {
        ...m,
        batches: m.batches.map((b) =>
          b.id === batchId ? { ...b, [field]: value } : b
        ),
      };
    });
    saveLedger({ ...ledgerState, months: nextMonths });
  };

  const deleteBatch = (batchId: string) => {
    if (!ledgerState || !currentMonthLedger) return;
    const nextMonths = ledgerState.months.map((m) =>
      m.month === selectedMonth
        ? { ...m, batches: m.batches.filter((b) => b.id !== batchId) }
        : m
    );
    saveLedger({ ...ledgerState, months: nextMonths });
  };

  const monthSummary =
    ledgerSummary?.perMonth.find((p) => p.month === selectedMonth) ?? null;

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 font-sans">
          بوابة المستثمر: تحليل المناطق
        </h1>
        <p className="text-slate-600">
          اختر المنطقة لعرض تفاصيل التشغيل وحساب عوائدك الشخصية ونقطة التعادل.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(zoneData) as ZoneId[]).map((id) => (
          <button
            key={id}
            onClick={() => setSelectedZone(id)}
            className={`p-4 rounded-xl border-2 transition text-right ${
              selectedZone === id
                ? "border-indigo-600 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs text-slate-500">المنطقة</p>
            <p className="text-xl font-bold text-slate-800">{id}</p>
            <p className="text-xs truncate text-slate-600">{zoneData[id].name}</p>
          </button>
        ))}
      </div>

      {selectedZone === "A" && ledgerLoaded && (
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setMainTab("calc")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mainTab === "calc" ? "bg-white shadow text-indigo-600" : "text-slate-600"
            }`}
          >
            الحاسبة
          </button>
          <button
            onClick={() => setMainTab("ledger")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mainTab === "ledger" ? "bg-white shadow text-indigo-600" : "text-slate-600"
            }`}
          >
            دفتر التشغيل
          </button>
          <button
            onClick={() => setMainTab("budget")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mainTab === "budget" ? "bg-white shadow text-indigo-600" : "text-slate-600"
            }`}
          >
            الميزانية السنوية
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 h-fit lg:col-span-1">
          <h2 className="text-lg font-bold mb-4">إعدادات الاستثمار ({selectedZone})</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                مبلغ الاستثمار (ريال)
              </label>
              <input
                type="text"
                value={formatNumber(investmentAmount)}
                onChange={(e) => {
                  const v = parseNumber(e.target.value);
                  if (v >= 0) handleInvestmentChange(v);
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-slate-400 italic">
                * التقييم التقديري للمنطقة (Cap Rate):{" "}
                {formatSAR(currentZone.zoneValuation)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                نموذج الصفقة: مشاركة أرباح
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                حصة المستثمر القصوى (A/B/C): 50% عند تمويل 100% من المطلوب
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Zone-D: قبل التعادل 90% وبعده 50%
              </p>
              <button
                type="button"
                onClick={() =>
                  handleInvestmentChange(REQUIRED_CAPITAL[selectedZone])
                }
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 underline"
              >
                إعادة تعيين للمبلغ المطلوب
              </button>
              {selectedZone === "A" && ledgerState && (
                <button
                  type="button"
                  onClick={handleResetLedger}
                  className="block mt-2 text-xs text-amber-600 hover:text-amber-800 underline"
                >
                  Reset Ledger
                </button>
              )}
            </div>

            {hasLedgerData && mainTab === "calc" && (
              <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                يوجد دفتر تشغيل مخصص — نتائج الميزانية السنوية تعتمد على الدفتر.
              </p>
            )}

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">نقطة التعادل المتوقعة:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {mainTab === "budget" && ledgerSummary?.breakEvenMonth
                    ? ledgerSummary.breakEvenMonth
                    : mainTab === "ledger" && ledgerSummary?.breakEvenMonth
                      ? ledgerSummary.breakEvenMonth
                      : displayBreakEven}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">إجمالي ربح 10 سنوات:</span>
                <span className="font-bold text-indigo-600">
                  {mainTab === "budget" && ledgerSummary
                    ? formatSAR(ledgerSummary.yearly.investorProfit)
                    : formatSAR(projections[9]?.cumulativeInvestorProfit ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {((selectedZone !== "A") || (selectedZone === "A" && mainTab === "calc")) && (
            <>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab("company")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === "company" ? "bg-white shadow text-indigo-600" : "text-slate-600"
                  }`}
                >
                  أداء الشركة المستقلة
                </button>
                <button
                  onClick={() => setActiveTab("investor")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === "investor" ? "bg-white shadow text-indigo-600" : "text-slate-600"
                  }`}
                >
                  أرباحي كمستثمر
                </button>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-sm font-bold text-slate-700">السنة</th>
                        {activeTab === "company" ? (
                          <>
                            <th className="px-4 py-3 text-sm font-bold text-slate-700">الإيراد</th>
                            <th className="px-4 py-3 text-sm font-bold text-slate-700">المصاريف</th>
                            <th className="px-4 py-3 text-sm font-bold text-slate-700 text-emerald-700">صافي الربح</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-3 text-sm font-bold text-slate-700">الربح السنوي</th>
                            <th className="px-4 py-3 text-sm font-bold text-slate-700">التراكمي</th>
                            <th className="px-4 py-3 text-sm font-bold text-slate-700">التعادل</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projections.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">سنة {row.year}</td>
                          {activeTab === "company" ? (
                            <>
                              <td className="px-4 py-3 text-sm text-slate-600">{formatSAR(row.companyRevenue)}</td>
                              <td className="px-4 py-3 text-sm text-slate-600">{formatSAR(row.companyOpex)}</td>
                              <td className="px-4 py-3 text-sm font-bold text-emerald-600">{formatSAR(row.companyNetProfit)}</td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 text-sm text-slate-600">{formatSAR(row.investorProfit)}</td>
                              <td className="px-4 py-3 text-sm font-bold text-indigo-600">{formatSAR(row.cumulativeInvestorProfit)}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-[80px]">
                                  <div
                                    className={`h-full ${row.cumulativeInvestorProfit >= safeInvestment ? "bg-emerald-500" : "bg-amber-400"}`}
                                    style={{
                                      width: `${Math.min(100, safeInvestment > 0 ? (row.cumulativeInvestorProfit / safeInvestment) * 100 : 0)}%`,
                                    }}
                                  />
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {mainTab === "ledger" && selectedZone === "A" && ledgerState && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">دفتر التشغيل</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">الشهر</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2"
                >
                  {ledgerState.months.map((m) => (
                    <option key={m.month} value={m.month}>
                      {m.month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2">العدد</th>
                      <th className="px-3 py-2">عمولة/سيارة</th>
                      <th className="px-3 py-2">الإجمالي</th>
                      <th className="px-3 py-2">ملاحظة</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMonthLedger?.batches.map((b) => (
                      <tr key={b.id} className="border-b border-slate-100">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={formatNumber(b.count)}
                            onChange={(e) =>
                              updateBatch(b.id, "count", parseNumber(e.target.value))
                            }
                            className="w-24 rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={formatNumber(b.commission)}
                            onChange={(e) =>
                              updateBatch(b.id, "commission", parseNumber(e.target.value))
                            }
                            className="w-28 rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-3 py-2 font-medium">
                          {formatSAR(b.count * b.commission)}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={b.note ?? ""}
                            onChange={(e) =>
                              updateBatch(b.id, "note", e.target.value)
                            }
                            className="w-32 rounded border px-2 py-1 text-xs"
                            placeholder="ملاحظة"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => deleteBatch(b.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={addBatch}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                إضافة دفعة
              </button>

              {monthSummary && (
                <div className="mt-6 pt-4 border-t border-slate-200 space-y-1 text-sm">
                  <p>إجمالي السيارات: {formatNumber(monthSummary.totalCars)}</p>
                  <p>Gross: {formatSAR(monthSummary.gross)}</p>
                  <p>LandCut100: {formatSAR(monthSummary.landCut100)}</p>
                  <p>OPEX (25%): {formatSAR(monthSummary.opex)}</p>
                  <p>ProfitAfterOpex: {formatSAR(monthSummary.profitAfterOpex)}</p>
                </div>
              )}
            </Card>
          )}

          {mainTab === "budget" && selectedZone === "A" && ledgerSummary && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">الميزانية السنوية</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Gross</p>
                  <p className="font-bold">{formatSAR(ledgerSummary.yearly.gross)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">OPEX</p>
                  <p className="font-bold">{formatSAR(ledgerSummary.yearly.opex)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">ProfitAfterOpex</p>
                  <p className="font-bold">{formatSAR(ledgerSummary.yearly.profitAfterOpex)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">حصة ملاك الأرض</p>
                  <p className="font-bold">{formatSAR(ledgerSummary.yearly.landOwnerShare50)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">ربح المشغل</p>
                  <p className="font-bold">{formatSAR(ledgerSummary.yearly.operatorProfit)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">ربح المستثمر</p>
                  <p className="font-bold text-indigo-600">{formatSAR(ledgerSummary.yearly.investorProfit)}</p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p className="text-xs text-indigo-600">نقطة التعادل</p>
                  <p className="font-bold">{ledgerSummary.breakEvenMonth ?? "—"}</p>
                </div>
              </div>

              <h4 className="font-semibold mb-2">ربع سنوي</h4>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2">الفترة</th>
                      <th className="px-3 py-2">Gross</th>
                      <th className="px-3 py-2">OPEX</th>
                      <th className="px-3 py-2">ProfitAfterOpex</th>
                      <th className="px-3 py-2">ربح المستثمر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
                      <tr key={q} className="border-b border-slate-100">
                        <td className="px-3 py-2 font-medium">{q}</td>
                        <td className="px-3 py-2">{formatSAR(ledgerSummary.quarterly[q].gross)}</td>
                        <td className="px-3 py-2">{formatSAR(ledgerSummary.quarterly[q].opex)}</td>
                        <td className="px-3 py-2">{formatSAR(ledgerSummary.quarterly[q].profitAfterOpex)}</td>
                        <td className="px-3 py-2 font-medium">{formatSAR(ledgerSummary.quarterly[q].investorProfit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-semibold mb-2">شهري (مختصر)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2">الشهر</th>
                      <th className="px-3 py-2">Gross</th>
                      <th className="px-3 py-2">OPEX</th>
                      <th className="px-3 py-2">ProfitAfterOpex</th>
                      <th className="px-3 py-2">ربح المستثمر</th>
                      <th className="px-3 py-2">التراكمي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerSummary.perMonth.map((p) => (
                      <tr key={p.month} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="px-3 py-2 font-medium">{p.month}</td>
                        <td className="px-3 py-2">{formatSAR(p.gross)}</td>
                        <td className="px-3 py-2">{formatSAR(p.opex)}</td>
                        <td className="px-3 py-2">{formatSAR(p.profitAfterOpex)}</td>
                        <td className="px-3 py-2">{formatSAR(p.investorProfit)}</td>
                        <td className="px-3 py-2 font-bold">{formatSAR(p.cumulativeInvestorProfit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card className="p-6 bg-slate-50 border-none shadow-none">
        <h3 className="text-lg font-bold mb-4 text-slate-800">
          التفاصيل التشغيلية لمنطقة ({selectedZone})
        </h3>
        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-3">
            <h4 className="font-bold text-indigo-600">نموذج الإيرادات</h4>
            <ul className="space-y-2 text-slate-600">
              {selectedZone === "A" && (
                <li>
                  • يعتمد على عمولات المزاد (يبدأ من متوسط 1500 ريال لكل سيارة بعد مرحلة النمو الأولى).
                </li>
              )}
              {selectedZone === "B" && (
                <li>• تأجير مواقف سيارات يومي وشريحة من المواقف الطويلة الأمد.</li>
              )}
              {selectedZone === "C" && (
                <li>• سكن موظفين (198 غرفة) بعقود تشغيلية مستقرة.</li>
              )}
              {selectedZone === "D" && (
                <li>• مركز صيانة وخدمات سيارات متكامل بنظام تشغيل DASM-e.</li>
              )}
              <li>• نسبة الإشغال المستهدفة: 80% - 90% خلال السنوات الأولى.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-indigo-600">هيكل المصاريف</h4>
            <ul className="space-y-2 text-slate-600">
              <li>• تشمل المصاريف: الصيانة، الحراسة، الفواتير، وفريق الإدارة.</li>
              <li>• المنطقة أ (المزاد) هي الأعلى تشغيلياً (30%) نظراً لمتطلبات التسويق والتنظيم.</li>
              <li>• المنطقة د تتبع نظام توزيع فريد يحمي المستثمر حتى استرداد رأس المال.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
