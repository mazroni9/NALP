"use client";
import { Button } from "@/components/ui/Button";

import { Card } from "@/components/ui/Card";
import { formatNumber, formatSAR } from "@/lib/formatNumber";
import { PARTNERS, calcPartnerData } from "@/lib/partnersData";
import { useState, useMemo } from "react";
import { computeDistributionTimeline } from "@/lib/distributionTimeline";

const ADMIN_PIN = "NALP-ADMIN-2026";

export default function PartnersPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [partner, setPartner] = useState<(typeof PARTNERS)[0] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"partner" | "all">("partner");

  const timeline = useMemo(() => computeDistributionTimeline({ years: 8 }), []);

  const handleLogin = () => {
    setError("");
    const cleanPin = pin.trim();
    if (cleanPin === ADMIN_PIN) {
      setIsAdmin(true);
      setPartner(null);
      setSelectedPartnerId(PARTNERS[0]?.id ?? "");
      setActiveTab("all");
      return;
    }
    const found = PARTNERS.find((p) => p.pin === cleanPin);
    if (found) {
      setPartner(found);
      setIsAdmin(false);
      setActiveTab("partner");
    } else {
      setError("رمز غير صحيح، يرجى التواصل مع إدارة الشركة");
    }
  };

  const displayPartner = isAdmin
    ? PARTNERS.find((p) => p.id === selectedPartnerId) ?? PARTNERS[0]
    : partner;

  if (!displayPartner && !isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8" dir="rtl">
        <Card className="w-full max-w-md">
          <h1 className="text-xl font-bold text-slate-800">لوحة الشركاء — ملاك الأرض</h1>
          <p className="mt-1 text-sm text-slate-600">أدخل رمز الشريك للوصول إلى بياناتك</p>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">أدخل رمز الشريك</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="مثال: AE01"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <Button onClick={handleLogin} className="mt-4 w-full">
              دخول
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const data = displayPartner ? calcPartnerData(displayPartner) : null;

  const handleLogout = () => {
    setPartner(null);
    setPin("");
    setError("");
    setIsAdmin(false);
    setSelectedPartnerId("");
  };

  const GROUP_ORDER = ["أبناء أحمد عتيق", "أبناء عطية", "أبناء عبدالرحمن"] as const;
  const sortedPartners = [...PARTNERS].sort(
    (a, b) =>
      GROUP_ORDER.indexOf(a.group as (typeof GROUP_ORDER)[number]) -
      GROUP_ORDER.indexOf(b.group as (typeof GROUP_ORDER)[number])
  );

  const adminPartnerRows = sortedPartners.map((p) => {
    const d = calcPartnerData(p);
    return {
      name: p.name,
      group: p.group,
      sharePercent: p.sharePercent,
      shares: d.shares,
      annualIncome: d.annualIncome,
      total8Y: d.totalIncome8Y,
    };
  });

  const adminTotals = adminPartnerRows.reduce(
    (acc, r) => ({
      sharePercent: acc.sharePercent + r.sharePercent,
      shares: acc.shares + r.shares,
      annualIncome: acc.annualIncome + r.annualIncome,
      total8Y: acc.total8Y + r.total8Y,
    }),
    { sharePercent: 0, shares: 0, annualIncome: 0, total8Y: 0 }
  );

  const activePartner = displayPartner;

  const sellStepsText = data ? `يحق لك بيع حصتك لأي مستثمر خارجي أو لشريك آخر في أي وقت خلال مدة المشروع.
خطوات البيع:
① تواصل مع إدارة الشركة لإشعار البيع
② يُعرض على باقي الشركاء حق الأولوية (15 يوم)
③ إذا لم يمارس أحد حق الأولوية → يحق بيعها لطرف ثالث
④ يُوثَّق نقل الملكية لدى كاتب العدل وتُحدَّث سجلات الشركة
القيمة المرجعية للبيع الآن: ${formatSAR(data.saleValueNow)}` : "";

  return (
    <div className="p-8" dir="rtl">
      {isAdmin && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-amber-800">
          ⚙️ وضع المدير — تصفح بيانات جميع الشركاء
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">لوحة الشركاء</h1>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-indigo-600">
          تسجيل الخروج
        </button>
      </div>

      {isAdmin && (
        <div className="mb-8 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 text-sm font-bold transition-all ${
              activeTab === "all"
                ? "border-b-4 border-indigo-600 bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            }`}
          >
            📋 جدول حصص الشركاء
          </button>
          <button
            onClick={() => setActiveTab("partner")}
            className={`px-6 py-3 text-sm font-bold transition-all ${
              activeTab === "partner"
                ? "border-b-4 border-indigo-600 bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            }`}
          >
            👤 بيانات الشريك المفصلة
          </button>
        </div>
      )}

      <div className="space-y-6">
        {activeTab === "all" && isAdmin ? (
          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800">جدول حصص جميع الشركاء</h2>
              <div className="text-xs text-slate-400">محدث: فبراير 2026</div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-3 font-semibold text-slate-700">الاسم</th>
                    <th className="px-3 py-3 font-semibold text-slate-700">المجموعة</th>
                    <th className="px-3 py-3 font-semibold text-slate-700 text-center">الحصة%</th>
                    <th className="px-3 py-3 font-semibold text-slate-700 text-center">الأسهم</th>
                    <th className="px-3 py-3 font-semibold text-slate-700 text-center">الدخل السنوي</th>
                    <th className="px-3 py-3 font-semibold text-slate-700 text-center">إجمالي 8 سنوات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminPartnerRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3 font-medium text-slate-800">{r.name}</td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{r.group}</td>
                      <td className="px-3 py-3 text-center text-slate-800 font-medium">{r.sharePercent}%</td>
                      <td className="px-3 py-3 text-center text-slate-600">{formatNumber(r.shares)}</td>
                      <td className="px-3 py-3 text-center font-bold text-indigo-600">{formatNumber(r.annualIncome)}</td>
                      <td className="px-3 py-3 text-center font-bold text-slate-800">{formatNumber(r.total8Y)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-indigo-50 border-t-2 border-indigo-200 font-bold">
                    <td className="px-3 py-4 text-indigo-900 text-base" colSpan={2}>الإجمالي العام</td>
                    <td className="px-3 py-4 text-center text-indigo-900 text-base">{formatNumber(adminTotals.sharePercent, { maximumFractionDigits: 2 })}%</td>
                    <td className="px-3 py-4 text-center text-indigo-900">{formatNumber(adminTotals.shares)}</td>
                    <td className="px-3 py-4 text-center text-indigo-900">{formatNumber(adminTotals.annualIncome)}</td>
                    <td className="px-3 py-4 text-center text-indigo-900">{formatNumber(adminTotals.total8Y)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        ) : activePartner && data && (
          <div className="space-y-6">
            {isAdmin && (
              <Card className="bg-slate-50 border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-indigo-500 rounded-full" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">تصفح بيانات شريك محدد</label>
                    <select
                      value={selectedPartnerId}
                      onChange={(e) => setSelectedPartnerId(e.target.value)}
                      className="w-full bg-white rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 px-4 py-2 text-sm font-medium transition-all"
                    >
                      {PARTNERS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — {p.group} ({p.sharePercent}%)</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-3">هويتك في الشركة</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-slate-500">الاسم</dt><dd className="font-bold text-slate-800">{activePartner.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">المجموعة</dt><dd className="font-medium px-2 py-0.5 bg-slate-100 rounded text-xs">{activePartner.group}</dd></div>
                  <div className="flex justify-between border-t border-slate-50 pt-2"><dt className="text-slate-500">نسبة الملكية</dt><dd className="font-black text-indigo-600">{activePartner.sharePercent}%</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">عدد الأسهم</dt><dd className="font-bold">{formatNumber(data.shares)} سهم</dd></div>
                </dl>
              </Card>

              <Card className="bg-indigo-600 text-white">
                <h2 className="text-lg font-bold border-b border-indigo-500 pb-3">ملخص العوائد</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-indigo-100 text-xs">الدخل السنوي (تقدير من النموذج)</p>
                    <p className="text-3xl font-black">{formatNumber(data.annualIncome)} <span className="text-sm font-normal">ريال</span></p>
                  </div>
                  <div className="pt-2 border-t border-indigo-500">
                    <p className="text-indigo-100 text-xs">إجمالي دخل 8 سنوات (تقدير من النموذج)</p>
                    <p className="text-xl font-bold">{formatNumber(data.totalIncome8Y)} ريال</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="border-r-4 border-r-emerald-500">
              <h2 className="text-lg font-bold text-slate-800 mb-3">متى تستلم أرباحك؟</h2>
              <p className="text-sm text-slate-600 mb-3">
                تُوزَّع الأرباح على الشركاء بعد خصم التالي بالترتيب: (١) مصاريف التشغيل OPEX، (٢) مصاريف مجلس الإدارة (حد أقصى 10٪)، (٣) سداد الديون التأسيسية. الباقي — صافي الموزَّع — يُقسَّم على الشركاء بحسب حصة كلٍّ منهم ويُدفع كل 3 أشهر.
              </p>
              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
                <li><strong>أول توزيع للشركاء:</strong> السنة {timeline.firstProfitYear} — بمبلغ تقديري {formatNumber(timeline.firstProfitAmount)} ريال (للمشروع كاملاً).</li>
                <li><strong>استقرار التوزيع:</strong> من السنة {timeline.stabilizationYear} فصاعداً (بعد سداد الديون بالكامل).</li>
                <li><strong>حصتك أنت:</strong> {activePartner.sharePercent}٪ من صافي الموزَّع كل ربع سنة.</li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-slate-800 mb-4">تطور قيمة حصتك من الأرض</h2>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-slate-500 text-xs">مساحة حصتك الصافية</p>
                  <p className="text-2xl font-black text-indigo-600">{formatNumber(data.landAreaSqm)} <span className="text-sm font-normal">م²</span></p>
                </div>
                <div className="hidden md:block h-12 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-slate-500 text-xs">سعر المتر التقديري (سنة 8)</p>
                  <p className="text-xl font-bold text-slate-800">2,500 ريال</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                  <h3 className="font-bold text-sm text-slate-700">تقديرات القيمة المالية</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-white border border-slate-100 rounded-lg">
                    <p className="text-slate-400 text-[10px] mb-1 italic">سعر الشراء</p>
                    <p className="font-bold text-slate-700">{formatNumber(data.landValueNow)}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-lg">
                    <p className="text-slate-400 text-[10px] mb-1">نهاية سنة 1</p>
                    <p className="font-bold text-slate-700">{formatNumber(data.landValueYear1)}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-lg">
                    <p className="text-slate-400 text-[10px] mb-1">نهاية سنة 4</p>
                    <p className="font-bold text-slate-700">{formatNumber(data.landValueYear4)}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-indigo-600 text-[10px] mb-1 font-bold">نهاية سنة 8</p>
                    <p className="font-black text-indigo-700">{formatNumber(data.landValueYear8)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black mb-1">إجمالي الثروة (السنة 8)</h3>
                    <p className="text-indigo-200 text-xs font-medium">الأرباح التراكمية + قيمة حصة الأرض — تقدير من النموذج</p>
                  </div>
                  <div className="bg-indigo-500/20 p-2 rounded-lg">📈</div>
                </div>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 to-white">
                  {formatNumber(data.totalWealthYear8)} <span className="text-lg font-normal opacity-80">ريال</span>
                </p>
              </div>
            </Card>

            <Card className="border-l-4 border-l-amber-400">
              <h2 className="text-lg font-bold text-slate-800 mb-2">💡 كيف تبيع حصتك؟</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {sellStepsText}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
