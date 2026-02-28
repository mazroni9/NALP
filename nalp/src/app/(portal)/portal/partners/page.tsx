"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { COMPANY, PARTNERS, calcPartnerData } from "@/lib/partnersData";
import { useState } from "react";

const ADMIN_PIN = "NALP-ADMIN-2026";

export default function PartnersPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [partner, setPartner] = useState<(typeof PARTNERS)[0] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"partner" | "all">("partner");

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
  const pricePerM2ByYear: Record<number, number> = {
    1: 1_200, 2: 1_350, 3: 1_500, 4: 1_800,
    5: 1_950, 6: 2_100, 7: 2_300, 8: 2_500,
  };

  const wealthRows = data ? Array.from({ length: COMPANY.projectYears }, (_, i) => {
    const year = i + 1;
    const annualIncome = data.annualIncome;
    const cumulativeIncome = annualIncome * year;
    const pricePerM2 = pricePerM2ByYear[year];
    const landValue = Math.round(data.landAreaSqm * pricePerM2);
    const remainingYears = 8 - year;
    const remainingIncome = remainingYears * annualIncome;
    const discount = year <= 3 ? 0.35 : year <= 6 ? 0.2 : 0;
    const saleValue = Math.round((landValue + remainingIncome) * (1 - discount));
    const totalWealth = cumulativeIncome + landValue;
    return { year, annualIncome, cumulativeIncome, pricePerM2, landValue, saleValue, totalWealth };
  }) : [];

  const sellStepsText = data ? `يحق لك بيع حصتك لأي مستثمر خارجي أو لشريك آخر في أي وقت خلال مدة المشروع.
خطوات البيع:
① تواصل مع إدارة الشركة لإشعار البيع
② يُعرض على باقي الشركاء حق الأولوية (15 يوم)
③ إذا لم يمارس أحد حق الأولوية → يحق بيعها لطرف ثالث
④ يُوثَّق نقل الملكية لدى كاتب العدل وتُحدَّث سجلات الشركة
القيمة المرجعية للبيع الآن: ${data.saleValueNow.toLocaleString("en-US")} ريال` : "";

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
        <div className="mb-6 flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("partner")}
            className={`px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === "partner"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            بيانات الشريك
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            جدول حصص الشركاء
          </button>
        </div>
      )}

      <div className="space-y-6">
        {activeTab === "all" && isAdmin ? (
          <Card>
            <h2 className="text-lg font-semibold text-slate-800">جدول حصص جميع الشركاء</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-2 font-medium text-slate-600">الاسم</th>
                    <th className="px-2 py-2 font-medium text-slate-600">المجموعة</th>
                    <th className="px-2 py-2 font-medium text-slate-600">الحصة%</th>
                    <th className="px-2 py-2 font-medium text-slate-600">الأسهم</th>
                    <th className="px-2 py-2 font-medium text-slate-600">الدخل السنوي</th>
                    <th className="px-2 py-2 font-medium text-slate-600">إجمالي 8 سنوات</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPartnerRows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="px-2 py-2">{r.name}</td>
                      <td className="px-2 py-2 text-slate-600">{r.group}</td>
                      <td className="px-2 py-2">{r.sharePercent}</td>
                      <td className="px-2 py-2">{r.shares.toLocaleString("en-US")}</td>
                      <td className="px-2 py-2">{r.annualIncome.toLocaleString("en-US")}</td>
                      <td className="px-2 py-2">{r.total8Y.toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-300 font-semibold">
                    <td className="px-2 py-2">الإجمالي</td>
                    <td className="px-2 py-2">—</td>
                    <td className="px-2 py-2">{adminTotals.sharePercent.toFixed(2)}%</td>
                    <td className="px-2 py-2">{adminTotals.shares.toLocaleString("en-US")}</td>
                    <td className="px-2 py-2">{adminTotals.annualIncome.toLocaleString("en-US")}</td>
                    <td className="px-2 py-2">{adminTotals.total8Y.toLocaleString("en-US")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        ) : activePartner && data && (
          <>
            {isAdmin && (
              <Card>
                <label className="block text-sm font-medium text-slate-700">اختر الشريك</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2"
                >
                  {PARTNERS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.group}</option>
                  ))}
                </select>
              </Card>
            )}
            <Card>
              <h2 className="text-lg font-semibold text-slate-800">هويتك في الشركة</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-slate-500">اسم الشريك</dt><dd className="font-medium">{activePartner.name}</dd></div>
                <div><dt className="text-slate-500">المجموعة</dt><dd className="font-medium">{activePartner.group}</dd></div>
                <div><dt className="text-slate-500">نسبة ملكيتك</dt><dd className="font-medium">{activePartner.sharePercent}%</dd></div>
                <div><dt className="text-slate-500">الأسهم</dt><dd className="font-medium">{data.shares} سهم</dd></div>
              </dl>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-slate-800">دخلك التقديري</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-slate-500">دخلك السنوي</dt><dd className="text-lg font-bold text-indigo-600">{data.annualIncome.toLocaleString("en-US")} ريال</dd></div>
                <div><dt className="text-slate-500">إجمالي 8 سنوات</dt><dd className="text-lg font-bold text-indigo-600">{data.totalIncome8Y.toLocaleString("en-US")} ريال</dd></div>
              </dl>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-slate-800">تطور قيمة حصتك من الأرض</h2>
              <p className="mt-2 text-2xl font-bold text-indigo-600">مساحتك: {data.landAreaSqm.toLocaleString("en-US")} م²</p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th>الآن</th><th>سنة 1</th><th>سنة 4</th><th>سنة 8</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">{data.landValueNow.toLocaleString("en-US")}</td>
                      <td>{data.landValueYear1.toLocaleString("en-US")}</td>
                      <td>{data.landValueYear4.toLocaleString("en-US")}</td>
                      <td>{data.landValueYear8.toLocaleString("en-US")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 rounded-lg bg-indigo-900 p-4 text-white">
                <h3 className="font-semibold">إجمالي ثروتك نهاية السنة الثامنة</h3>
                <p className="mt-2 text-2xl font-bold">{data.totalWealthYear8.toLocaleString("en-US")} ريال</p>
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-slate-800">كيف تبيع حصتك</h2>
              <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{sellStepsText}</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
