"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { formatSAR } from "@/lib/formatNumber";
import {
  ZONE_OPERATIONAL,
  ZONE_D,
  REQUIRED_CAPITAL,
  type ZoneId,
} from "@/lib/financialCanon";

export default function InvestorsPage() {
  const [selectedZone, setSelectedZone] = useState<ZoneId>("A");
  const [investmentAmount, setInvestmentAmount] = useState<number>(
    REQUIRED_CAPITAL.A
  );

  useEffect(() => {
    setInvestmentAmount(REQUIRED_CAPITAL[selectedZone]);
  }, [selectedZone]);
  const [activeTab, setActiveTab] = useState<"company" | "investor">("company");

  const formatWithCommas = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/,/g, "")) || 0;
  };

  const zoneData = ZONE_OPERATIONAL;
  const currentZone = zoneData[selectedZone];

  const safeInvestment = Math.max(0, investmentAmount);
  const safeZoneValuation = Math.max(1, currentZone.zoneValuation);
  const investorSharePercent = Math.min(
    100,
    (safeInvestment / safeZoneValuation) * 100
  );

  const calculateProjections = () => {
    const years = Array.from({ length: 10 }, (_, i) => i + 1);
    let cumulativeInvestorProfit = 0;
    let breakEvenYear = -1;

    const companyRevenue = currentZone.annualRevenue;
    const companyNetProfit = currentZone.netAnnual;
    const companyOpex = companyRevenue - companyNetProfit;

    const projections = years.map((year) => {
      let investorProfit = 0;

      if (selectedZone === "D") {
        const sharePre = ZONE_D.investorSharePre;
        const sharePost = ZONE_D.investorSharePost;

        if (cumulativeInvestorProfit < safeInvestment) {
          investorProfit = companyNetProfit * sharePre;
        } else {
          investorProfit = companyNetProfit * sharePost;
        }
      } else {
        investorProfit = companyNetProfit * (investorSharePercent / 100);
      }

      cumulativeInvestorProfit += investorProfit;
      if (breakEvenYear === -1 && cumulativeInvestorProfit >= safeInvestment) {
        breakEvenYear = year;
      }

      return {
        year,
        companyRevenue,
        companyNetProfit,
        companyOpex,
        investorProfit,
        cumulativeInvestorProfit,
      };
    });

    return { projections, breakEvenYear };
  };

  const { projections, breakEvenYear } = calculateProjections();

  const displayBreakEven =
    selectedZone === "D"
      ? `بعد ${ZONE_D.breakevenMonths} شهر تقريبًا`
      : breakEvenYear !== -1
        ? `السنة ${breakEvenYear}`
        : "تتجاوز 10 سنوات";

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
                value={formatWithCommas(investmentAmount)}
                onChange={(e) => {
                  const numericValue = parseNumber(e.target.value);
                  if (numericValue >= 0) {
                    setInvestmentAmount(numericValue);
                  }
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-slate-400 italic">
                * التقييم التقديري للمنطقة (Cap Rate):{" "}
                {formatSAR(currentZone.zoneValuation)}
              </p>
              <button
                type="button"
                onClick={() =>
                  setInvestmentAmount(REQUIRED_CAPITAL[selectedZone])
                }
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 underline"
              >
                إعادة تعيين للمبلغ المطلوب
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">نقطة التعادل المتوقعة:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {displayBreakEven}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">إجمالي ربح 10 سنوات:</span>
                <span className="font-bold text-indigo-600">
                  {formatSAR(projections[9].cumulativeInvestorProfit)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
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
                        <th className="px-4 py-3 text-sm font-bold text-slate-700 text-emerald-700">
                          صافي الربح
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 text-sm font-bold text-slate-700">
                          الربح السنوي
                        </th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-700">التراكمي</th>
                        <th className="px-4 py-3 text-sm font-bold text-slate-700">التعادل</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projections.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        سنة {row.year}
                      </td>
                      {activeTab === "company" ? (
                        <>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatSAR(row.companyRevenue)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatSAR(row.companyOpex)}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-emerald-600">
                            {formatSAR(row.companyNetProfit)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatSAR(row.investorProfit)}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-indigo-600">
                            {formatSAR(row.cumulativeInvestorProfit)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-[80px]">
                              <div
                                className={`h-full ${
                                  row.cumulativeInvestorProfit >= safeInvestment
                                    ? "bg-emerald-500"
                                    : "bg-amber-400"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    safeInvestment > 0
                                      ? (row.cumulativeInvestorProfit / safeInvestment) * 100
                                      : 0
                                  )}%`,
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
                  • يعتمد على عمولات المزاد (يبدأ من متوسط 1500 ريال لكل سيارة بعد مرحلة
                  النمو الأولى).
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
              <li>
                • المنطقة أ (المزاد) هي الأعلى تشغيلياً (30%) نظراً لمتطلبات التسويق
                والتنظيم.
              </li>
              <li>• المنطقة د تتبع نظام توزيع فريد يحمي المستثمر حتى استرداد رأس المال.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
