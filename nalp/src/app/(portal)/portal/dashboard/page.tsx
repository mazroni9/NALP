"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { formatSAR } from "@/lib/formatNumber";
import { REQUIRED_CAPITAL, ZONE_OPERATIONAL, type ZoneId } from "@/lib/financialCanon";
import {
  computeProjectMetrics,
  getScenarioAssumptions,
  getIncomeByZone,
  getIncomeByType,
  getSensitiveAssumptionsForZone,
  type ScenarioId,
} from "@/lib/finance";

const SCENARIO_LABELS: Record<ScenarioId, string> = {
  base: "أساسي (واقعي)",
  downside: "متحفظ",
  upside: "متفائل",
};

const ZONE_NAMES: Record<ZoneId, string> = {
  A: ZONE_OPERATIONAL.A.name,
  B: ZONE_OPERATIONAL.B.name,
  C: ZONE_OPERATIONAL.C.name,
  D: ZONE_OPERATIONAL.D.name,
};

export default function PortalDashboardPage() {
  const [scenario, setScenario] = useState<ScenarioId>("base");

  const years = 8;
  const metrics = useMemo(() => computeProjectMetrics(scenario, years), [scenario]);
  const metricsAll = useMemo(
    () => ({
      downside: computeProjectMetrics("downside", years),
      base: computeProjectMetrics("base", years),
      upside: computeProjectMetrics("upside", years),
    }),
    []
  );
  const incomeByZone = useMemo(
    () => getIncomeByZone(metrics, ZONE_NAMES),
    [metrics]
  );
  const incomeByType = useMemo(
    () => getIncomeByType(metrics, ZONE_NAMES),
    [metrics]
  );
  const assumptions = useMemo(() => getScenarioAssumptions(scenario), [scenario]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-8" dir="rtl">
      {/* Title — لغة استثمارية رزينة */}
      <section>
        <h1 className="text-3xl font-bold text-slate-800">
          لوحة المستثمر — NALP
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          مجمع متعدد الاستخدامات: مزاد، مواقف، سكن، مركز خدمات. الأرقام من نموذج إسقاط وقابلة للتعديل حسب السيناريو — وليست التزاماً.
        </p>
      </section>

      {/* 1. Investment Snapshot */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          لقطة الاستثمار
        </h2>
        <p className="mb-3 text-sm text-slate-500">
          تقدير يعتمد على الافتراضات المختارة — وليس التزاماً. التقييم تحت نسبة الرسملة المختارة.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-slate-500">دخل الملاك (8 سنوات)</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(metrics.ownerTotalIncome8Years)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-500">متوسط الدخل السنوي</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(metrics.avgAnnualIncome)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-500">تقييم الخروج (Cap {metrics.capRate}%)</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatSAR(metrics.valuationAtExit)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-500">عدد المناطق</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {metrics.zonesCount}
            </p>
          </Card>
        </div>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-700">
          <span className="font-medium">نطاق النتائج حسب السيناريو:</span> دخل الملاك (8 سنوات) من {formatSAR(metricsAll.downside.ownerTotalIncome8Years)} (متحفظ) إلى {formatSAR(metricsAll.upside.ownerTotalIncome8Years)} (متفائل). التقييم من {formatSAR(metricsAll.downside.valuationAtExit)} إلى {formatSAR(metricsAll.upside.valuationAtExit)} حسب نسبة الرسملة.
        </div>
      </section>

      {/* 2. Scenario Selector */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          اختيار السيناريو
        </h2>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-3">
            النتائج أعلاه تعتمد على السيناريو المختار. تغيير السيناريو يعدّل افتراضات الإيراد والمصاريف ونسبة الرسملة دون تغيير منطق المحرك.
          </p>
          <div className="flex flex-wrap gap-2">
            {(["downside", "base", "upside"] as ScenarioId[]).map((id) => (
              <button
                key={id}
                onClick={() => setScenario(id)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                  scenario === id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {SCENARIO_LABELS[id]}
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* 3. Key Assumptions */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          الافتراضات (السيناريو الحالي)
        </h2>
        <Card className="p-4">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• نسبة الرسملة (Cap Rate): {Math.round(assumptions.project.capRate * 100)}%</li>
            <li>• سنوات الإسقاط: {assumptions.project.projectionYearsDefault}</li>
            <li>• رأس المال المطلوب — أ: {formatSAR(assumptions.project.requiredCapital.A)}، ب: {formatSAR(assumptions.project.requiredCapital.B)}، ج: {formatSAR(assumptions.project.requiredCapital.C)}، د: {formatSAR(assumptions.project.requiredCapital.D)}</li>
            <li>• توزيع الربح المتبقي (بعد استرداد رأس المال والعائد المفضل): أرض 40%، مستثمر 40%، مشغل 20%</li>
          </ul>
        </Card>
      </section>

      {/* 4. Risk Notes */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          ملاحظات مخاطر
        </h2>
        <Card className="p-4 border-amber-100 bg-amber-50/50">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• الأرقام المعروضة ناتجة عن نموذج إسقاط وليست التزاماً أو ضماناً.</li>
            <li>• منطقة ج (السكن) ومنطقة د (مركز الخدمات) تعتمدان على افتراضات إيراد وإشغال حساسة — أي تغيير فيها يؤثر مادياً على العوائد.</li>
            <li>• نقطة التعادل وتوزيع الأرباح تتغير حسب نسبة التمويل الفعلية ونتائج التشغيل.</li>
            <li>• تقييم الخروج يعتمد على نسبة رسملة سوقية — قد تختلف عند التنفيذ.</li>
          </ul>
        </Card>
      </section>

      {/* 5. What is fixed vs assumed */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          ما هو ثابت وما هو تقديري
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-2">ثابت (مقاس أو محدد مسبقاً)</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>• عدد الغرف في منطقة ج (198)</li>
              <li>• هيكل الصفقة (مشاركة أرباح، waterfall منطقة د)</li>
              <li>• رأس المال المطلوب لكل منطقة (قيم إدارية)</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-2">تقديري (يحتاج تحقق سوقي لاحقاً)</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>• نسبة الإشغال والأسعار (مناطق ج، د)</li>
              <li>• الإيراد الشهري لمركز الخدمات (د)</li>
              <li>• نسبة الرسملة وتقييم الخروج</li>
              <li>• منحنى نمو المزاد (سيارات/عمولات)</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 6. Income by zone */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          الدخل حسب المنطقة
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-700">المنطقة</th>
                  <th className="px-4 py-3 font-bold text-slate-700">دخل الملاك (8 سنوات)</th>
                  <th className="px-4 py-3 font-bold text-slate-700">متوسط سنوي</th>
                  <th className="px-4 py-3 font-bold text-slate-700">طبيعة الدخل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomeByZone.map((row) => (
                  <tr key={row.zoneId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.zoneName}</td>
                    <td className="px-4 py-3 text-slate-700">{formatSAR(row.ownerIncome8Years)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatSAR(row.avgAnnual)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.incomeTypes.map((t) => (t === "realEstate" ? "عقاري" : t === "operating" ? "تشغيلي" : t === "service" ? "خدمات" : "اقتصاديات المالك")).join("، ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 7. Income by type */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          الدخل حسب النوع الاقتصادي
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-700">النوع</th>
                  <th className="px-4 py-3 font-bold text-slate-700">دخل الملاك (8 سنوات)</th>
                  <th className="px-4 py-3 font-bold text-slate-700">متوسط سنوي</th>
                  <th className="px-4 py-3 font-bold text-slate-700">المناطق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomeByType.map((row) => (
                  <tr key={row.typeId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.label}</td>
                    <td className="px-4 py-3 text-slate-700">{formatSAR(row.ownerIncome8Years)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatSAR(row.avgAnnual)}</td>
                    <td className="px-4 py-3 text-slate-600">{row.zones.join("، ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 8. Owner share & structure */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          حصة المالك وهيكل الاستثمار
        </h2>
        <Card className="p-5">
          <p className="text-sm text-slate-600 mb-4">
            إجمالي دخل الملاك أعلاه يمثل حصة ملاك الأرض فقط (قبل توزيع حصة المستثمر والمشغل). المناطق أ/ب/ج: مشاركة أرباح حتى 50% للمستثمر عند تمويل 100%. منطقة د: Waterfall — 90% للمستثمر قبل التعادل، 50% بعده.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["A", "B", "C", "D"] as ZoneId[]).map((z) => (
              <div key={z} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{ZONE_NAMES[z]}</p>
                <p className="font-semibold text-slate-800">{formatSAR(REQUIRED_CAPITAL[z])}</p>
                <p className="text-xs text-slate-500">رأس المال المطلوب</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Zone C / D sensitivity alerts */}
      <section>
        <h2 className="mb-3 text-xl font-semibold text-slate-800">
          افتراضات حساسة — مناطق ج و د
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4 border-amber-200 bg-amber-50/70">
            <h3 className="font-semibold text-amber-800 mb-2">منطقة ج (السكن)</h3>
            <p className="text-xs text-amber-800 mb-2">
              تؤثر هذه الافتراضات مادياً على العوائد. لا تُعرض أرقام استرداد أو ربحية بصيغة قطعية ما لم تُوثّق بتحقق سوقي.
            </p>
            <ul className="space-y-1 text-sm text-slate-700">
              {getSensitiveAssumptionsForZone("C").map((a) => (
                <li key={a.key}>• {a.description} — {String(a.value)} {a.unit}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-4 border-amber-200 bg-amber-50/70">
            <h3 className="font-semibold text-amber-800 mb-2">منطقة د (مركز الخدمات)</h3>
            <p className="text-xs text-amber-800 mb-2">
              تؤثر هذه الافتراضات مادياً على العوائد. نقطة التعادل والربحية ناتجة عن النموذج وليست مضمونة.
            </p>
            <ul className="space-y-1 text-sm text-slate-700">
              {getSensitiveAssumptionsForZone("D").map((a) => (
                <li key={a.key}>• {a.description} — {String(a.value)} {a.unit}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
