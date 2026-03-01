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
  LEDGER_SCHEMA_VERSION,
  getDefaultLedgerState,
  defaultLedgerState,
  loadLedgerFromStorage,
  generateBatchId,
} from "@/lib/calculators/ledgerEngine";

const ZONE_A_MODE_KEY = "NALP_ZONE_A_MODE";
const isDev = process.env.NODE_ENV === "development";

export default function InvestorsPage() {
  const [selectedZone, setSelectedZone] = useState<ZoneId>("A");
  const [investmentAmount, setInvestmentAmount] = useState<number>(
    REQUIRED_CAPITAL.A
  );

  const [zoneAMode, setZoneAMode] = useState<"forecast" | "actual">("forecast");
  const [zoneAModeLoaded, setZoneAModeLoaded] = useState(false);

  const [ledgerState, setLedgerState] = useState<LedgerState | null>(null);
  const [ledgerLoaded, setLedgerLoaded] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);
  const [storageBytes, setStorageBytes] = useState<number>(0);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [lastError, setLastError] = useState<null | { message: string; stack?: string }>(null);
  const [ledgerSummaryState, setLedgerSummaryState] = useState<ReturnType<typeof computeZoneALedgerSummary> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(ZONE_A_MODE_KEY);
      if (stored === "forecast" || stored === "actual") {
        setZoneAMode(stored);
        if (stored === "actual") setMainTab("budget");
      }
    } catch {}
    setZoneAModeLoaded(true);
  }, []);

  const handleZoneAModeChange = (mode: "forecast" | "actual") => {
    setZoneAMode(mode);
    if (mode === "actual") setMainTab("budget");
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ZONE_A_MODE_KEY, mode);
      } catch {}
    }
  };

  useEffect(() => {
    const loaded = loadLedgerFromStorage(REQUIRED_CAPITAL.A);
    setLedgerState(loaded);
    setInvestmentAmount(loaded.investmentAmount);
    setLedgerError(null);
    setLedgerLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedZone !== "A") {
      setInvestmentAmount(REQUIRED_CAPITAL[selectedZone]);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
      setStorageBytes(raw ? new Blob([raw]).size : 0);
    } catch {
      setStorageBytes(0);
    }
  }, [ledgerState]);

  const isLedgerValid =
    ledgerState &&
    selectedZone === "A" &&
    Array.isArray(ledgerState.months) &&
    ledgerState.months.length > 0;

  useEffect(() => {
    if (!isLedgerValid || !ledgerState) {
      setLedgerSummaryState(null);
      setLastError(null);
      return;
    }
    try {
      const summary = computeZoneALedgerSummary(ledgerState);
      setLedgerSummaryState(summary);
      setLedgerError(null);
      setLastError(null);
    } catch (e) {
      setLedgerError("حدثت مشكلة في بيانات دفتر التشغيل المحفوظة.");
      setLastError({
        message: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      });
      setLedgerSummaryState(null);
    }
  }, [isLedgerValid, ledgerState]);

  const saveLedger = useCallback((state: LedgerState | null) => {
    if (!state) return;
    const toSave: LedgerState = {
      ...state,
      schemaVersion: state.schemaVersion ?? LEDGER_SCHEMA_VERSION,
    };
    setLedgerState(toSave);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(toSave));
      } catch {}
    }
  }, []);

  const handleCopyLedgerJson = () => {
    if (!ledgerState || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      navigator.clipboard.writeText(JSON.stringify(ledgerState, null, 2));
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    } catch {}
  };

  const handleClearCorruptData = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(LEDGER_STORAGE_KEY);
      window.location.reload();
    } catch {}
  };

  const handleResetLedgerFromError = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(LEDGER_STORAGE_KEY);
      } catch {}
    }
    const def = defaultLedgerState(investmentAmount, REQUIRED_CAPITAL.A);
    setLedgerState(def);
    setLedgerError(null);
    setLastError(null);
    saveLedger(def);
  };

  const handleCopyError = () => {
    if (!lastError || typeof navigator === "undefined" || !navigator.clipboard) return;
    const text = lastError.stack ? `${lastError.message}\n\n${lastError.stack}` : lastError.message;
    try {
      navigator.clipboard.writeText(text);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    } catch {}
  };

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

  const showForecastContent =
    selectedZone !== "A" || (selectedZone === "A" && zoneAMode === "forecast");

  const ledgerSummary = ledgerSummaryState;
  const showLedgerError = ledgerError !== null || lastError !== null;

  const hasLedgerData =
    isLedgerValid &&
    ledgerState &&
    ledgerState.months.some((m) => Array.isArray(m.batches) && m.batches.length > 0);

  const monthRow =
    ledgerSummary?.perMonth.find((r) => r.month === selectedMonth) ||
    ledgerSummary?.perMonth[0] ||
    null;

  const fundingRatio =
    ledgerState && selectedZone === "A" && ledgerState.requiredCapital > 0
      ? Math.min(ledgerState.investmentAmount / ledgerState.requiredCapital, 1)
      : 0;

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

      {selectedZone === "A" && ledgerLoaded && zoneAModeLoaded && (
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-500 mb-2">مصدر الحسابات</p>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              onClick={() => handleZoneAModeChange("forecast")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                zoneAMode === "forecast" ? "bg-white shadow text-indigo-600" : "text-slate-600"
              }`}
            >
              توقعات (Forecast)
            </button>
            <button
              onClick={() => handleZoneAModeChange("actual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                zoneAMode === "actual" ? "bg-white shadow text-indigo-600" : "text-slate-600"
              }`}
            >
              تشغيل فعلي (دفتر التشغيل)
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {zoneAMode === "forecast"
              ? "يعتمد على نموذج تقديري سنوي ثابت للمدخلات."
              : "يعتمد على إدخالات دفتر التشغيل الشهرية ويؤثر على التعادل والتوزيعات."}
          </p>
          {zoneAMode === "actual" && (
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit mt-4">
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
        </Card>
      )}

      {selectedZone === "A" && zoneAMode === "actual" && showLedgerError && (
        <Card className="p-6 border-amber-200 bg-amber-50">
          <p className="text-amber-800 font-medium mb-3">
            حدثت مشكلة في بيانات دفتر التشغيل المحفوظة.
          </p>
          <button
            type="button"
            onClick={handleResetLedgerFromError}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
          >
            إعادة تهيئة الدفتر
          </button>
        </Card>
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

            {hasLedgerData && zoneAMode === "forecast" && (
              <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                يوجد دفتر تشغيل مخصص — نتائج الميزانية السنوية تعتمد على الدفتر.
              </p>
            )}

            {selectedZone === "A" && zoneAMode === "actual" && !hasLedgerData && (
              <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                وضع التشغيل الفعلي يعتمد على دفتر التشغيل. ابدأ بإضافة دفعات للشهر الحالي.
              </p>
            )}

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">
                  {showForecastContent ? "نقطة التعادل المتوقعة:" : "نقطة التعادل:"}
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {selectedZone === "A" && zoneAMode === "actual" && ledgerSummary
                    ? (ledgerSummary.breakEvenMonth ?? "—")
                    : selectedZone === "A" && zoneAMode === "actual" && !hasLedgerData
                      ? "أدخل بيانات شهر واحد على الأقل"
                      : displayBreakEven}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  {showForecastContent ? "إجمالي ربح 10 سنوات:" : "إجمالي ربح السنة:"}
                </span>
                <span className="font-bold text-indigo-600">
                  {selectedZone === "A" && zoneAMode === "actual" && ledgerSummary
                    ? formatSAR(ledgerSummary.yearly.investorProfit)
                    : selectedZone === "A" && zoneAMode === "actual" && !hasLedgerData
                      ? "—"
                      : formatSAR(projections[9]?.cumulativeInvestorProfit ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {showForecastContent && (
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

          {mainTab === "ledger" && selectedZone === "A" && zoneAMode === "actual" && ledgerState && (
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

          {mainTab === "budget" && selectedZone === "A" && zoneAMode === "actual" && !hasLedgerData && (
            <Card className="p-8 text-center text-slate-500">
              أدخل بيانات شهر واحد على الأقل في دفتر التشغيل لعرض الميزانية السنوية.
            </Card>
          )}

          {mainTab === "budget" && selectedZone === "A" && zoneAMode === "actual" && hasLedgerData && ledgerSummary && (
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

      {selectedZone === "A" && zoneAMode === "actual" && ledgerSummary && monthRow ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <h3 className="text-lg font-bold text-slate-800">ملخص الشهر:</h3>
              {ledgerState && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                >
                  {ledgerState.months.map((m) => (
                    <option key={m.month} value={m.month}>
                      {m.month}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-3 text-sm divide-y divide-slate-100">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">إجمالي السيارات</span>
                <span className="font-medium">{formatNumber(monthRow.totalCars)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Gross</span>
                <span className="font-medium">{formatSAR(monthRow.gross)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">LandCut100</span>
                <span className="font-medium">{formatSAR(monthRow.landCut100)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">OPEX (25%)</span>
                <span className="font-medium">{formatSAR(monthRow.opex)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">ProfitAfterOpex</span>
                <span className="font-medium text-emerald-600">{formatSAR(monthRow.profitAfterOpex)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">حصة ملاك الأرض (LandOwnerShare50)</span>
                <span className="font-medium">{formatSAR(monthRow.landOwnerShare50)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">ربح المشغل (OperatorProfit)</span>
                <span className="font-medium">{formatSAR(monthRow.operatorProfit)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">ربح المستثمر (InvestorProfit)</span>
                <span className="font-medium text-indigo-600">{formatSAR(monthRow.investorProfit)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">صافي المشغل بعد المستثمر</span>
                <span className="font-medium">{formatSAR(monthRow.operatorNetAfterInvestor)}</span>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-800">حالة الصفقة</h3>
            <div className="space-y-3 text-sm divide-y divide-slate-100">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">الحالة</span>
                <span className={`font-medium ${monthRow.isPostBreakeven ? "text-emerald-600" : "text-amber-600"}`}>
                  {monthRow.isPostBreakeven ? "بعد التعادل" : "قبل التعادل"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">شهر التعادل</span>
                <span className="font-medium">{ledgerSummary.breakEvenMonth ?? "لم يتحقق بعد"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">LandCut100</span>
                <span className="font-medium">{monthRow.isPostBreakeven ? "متوقف" : "مفعل"}</span>
              </div>
              <div className="py-2">
                <p className="text-slate-600 mb-1">توزيع الربح الحالي:</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• ملاك الأرض: {monthRow.isPostBreakeven ? "50%" : "0%"}</li>
                  <li>• المشغل: {monthRow.isPostBreakeven ? "50%" : "100%"}</li>
                  <li>• المستثمر: 50% من حصة المشغل × نسبة التمويل</li>
                </ul>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">نسبة التمويل</span>
                <span className="font-medium">{formatNumber(fundingRatio * 100, { maximumFractionDigits: 1 })}%</span>
              </div>
              <button
                type="button"
                onClick={() => setMainTab("ledger")}
                className="mt-4 text-xs text-indigo-600 hover:text-indigo-800 underline"
              >
                عدّل بيانات التشغيل
              </button>
            </div>
          </Card>
        </div>
      ) : (
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
      )}

      {isDev && selectedZone === "A" && ledgerState && (
        <Card className="p-4 bg-slate-50">
          <h4 className="text-sm font-bold text-slate-600 mb-3">Diagnostics (Dev Only)</h4>
          {lastError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200">
              <h5 className="text-xs font-bold text-red-700 mb-2">Last Error</h5>
              <p className="text-xs font-mono text-red-800 mb-2">{lastError.message}</p>
              {lastError.stack && (
                <pre className="text-xs font-mono whitespace-pre-wrap text-red-700 overflow-x-auto max-h-40 overflow-y-auto">
                  {lastError.stack}
                </pre>
              )}
              <button
                type="button"
                onClick={handleCopyError}
                className="mt-2 px-3 py-1 text-xs rounded bg-red-200 hover:bg-red-300"
              >
                Copy Error
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono mb-4">
            <div><span className="text-slate-500">schemaVersion:</span> <span>{ledgerState.schemaVersion ?? "missing"}</span></div>
            <div><span className="text-slate-500">ledgerValid:</span> <span>{(Array.isArray(ledgerState.months) && ledgerState.months.length > 0) ? "yes" : "no"}</span></div>
            <div><span className="text-slate-500">monthsCount:</span> <span>{ledgerState.months?.length ?? 0}</span></div>
            <div><span className="text-slate-500">totalBatches:</span> <span>{Array.isArray(ledgerState.months) ? ledgerState.months.reduce((s, m) => s + (Array.isArray(m.batches) ? m.batches.length : 0), 0) : 0}</span></div>
            <div><span className="text-slate-500">hasData:</span> <span>{Array.isArray(ledgerState.months) && ledgerState.months.some((m) => Array.isArray(m.batches) && m.batches.some((b) => (b?.count ?? 0) > 0)) ? "yes" : "no"}</span></div>
            <div><span className="text-slate-500">selectedMonth:</span> <span>{selectedMonth || "—"}</span></div>
            <div><span className="text-slate-500">breakEvenMonth:</span> <span>{ledgerSummary?.breakEvenMonth ?? "—"}</span></div>
            <div><span className="text-slate-500">storageKey:</span> <span>{LEDGER_STORAGE_KEY}</span></div>
            <div><span className="text-slate-500">storageBytes:</span> <span>{storageBytes}</span></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyLedgerJson}
              className="px-3 py-1.5 text-xs rounded bg-slate-200 hover:bg-slate-300"
            >
              Copy Ledger JSON
            </button>
            <button
              type="button"
              onClick={handleResetLedgerFromError}
              className="px-3 py-1.5 text-xs rounded bg-slate-200 hover:bg-slate-300"
            >
              Reset Ledger
            </button>
            <button
              type="button"
              onClick={handleClearCorruptData}
              className="px-3 py-1.5 text-xs rounded bg-slate-200 hover:bg-slate-300"
            >
              Clear Corrupt Data
            </button>
            {copiedFeedback && <span className="text-xs text-emerald-600 self-center">Copied</span>}
          </div>
        </Card>
      )}
    </div>
  );
}
