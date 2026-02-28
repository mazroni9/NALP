"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { COMPANY, PARTNERS, calcPartnerData } from "@/lib/partnersData";
import { useState } from "react";

function findPartnerByPin(pin: string) {
  const normalized = pin.trim().toUpperCase();
  return PARTNERS.find((p) => p.pin.toUpperCase() === normalized);
}

export default function PartnersPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [partner, setPartner] = useState<(typeof PARTNERS)[0] | null>(null);

  const handleLogin = () => {
    setError("");
    const found = findPartnerByPin(pin);
    if (found) {
      setPartner(found);
    } else {
      setError("رمز غير صحيح، يرجى التواصل مع إدارة الشركة");
    }
  };

  if (!partner) {
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

  const data = calcPartnerData(partner);

  const yearIncomes = Array.from({ length: COMPANY.projectYears }, (_, i) => ({
    year: i + 1,
    income: data.annualIncome,
  }));

  const sellStepsText = `يحق لك بيع حصتك لأي مستثمر خارجي أو لشريك آخر في أي وقت خلال مدة المشروع.
خطوات البيع:
① تواصل مع إدارة الشركة لإشعار البيع
② يُعرض على باقي الشركاء حق الأولوية (15 يوم)
③ إذا لم يمارس أحد حق الأولوية → يحق بيعها لطرف ثالث
④ يُوثَّق نقل الملكية لدى كاتب العدل وتُحدَّث سجلات الشركة
القيمة المرجعية للبيع الآن: ${data.saleValueNow.toLocaleString("en-US")} ريال`;

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">لوحة الشريك</h1>
        <button
          onClick={() => {
            setPartner(null);
            setPin("");
            setError("");
          }}
          className="text-sm text-slate-500 hover:text-indigo-600"
        >
          تسجيل الخروج
        </button>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-slate-800">هويتك في الشركة</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">اسم الشريك</dt>
              <dd className="font-medium">{partner.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">المجموعة</dt>
              <dd className="font-medium">{partner.group}</dd>
            </div>
            <div>
              <dt className="text-slate-500">نسبة ملكيتك من الشركة</dt>
              <dd className="font-medium">{partner.sharePercent}%</dd>
            </div>
            <div>
              <dt className="text-slate-500">عدد الأسهم التقديرية (من 10,000 سهم)</dt>
              <dd className="font-medium">{data.shares} سهم</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-800">دخلك التقديري</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">دخلك السنوي</dt>
              <dd className="text-lg font-bold text-indigo-600">
                {data.annualIncome.toLocaleString("en-US")} ريال
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">دخلك الإجمالي خلال 8 سنوات</dt>
              <dd className="text-lg font-bold text-indigo-600">
                {data.totalIncome8Y.toLocaleString("en-US")} ريال
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-800">قيمة حصتك</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">الثروة الإجمالية نهاية السنة 8 (أرباح + قيمة أرضك)</dt>
              <dd className="text-lg font-bold text-indigo-600">
                {data.totalWealthYear8.toLocaleString("en-US")} ريال
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">القيمة التقديرية الحالية للبيع الآن</dt>
              <dd className="text-lg font-bold text-indigo-600">
                {data.saleValueNow.toLocaleString("en-US")} ريال
              </dd>
              <p className="mt-1 text-xs text-slate-400">مخفّضة 35% لعدم اكتمال دورة المشروع</p>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-800">كيف تبيع حصتك</h2>
          <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{sellStepsText}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-800">جدول الدخل السنوي</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  {yearIncomes.map((y) => (
                    <th key={y.year} className="px-2 py-2 font-medium text-slate-600">
                      السنة {y.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {yearIncomes.map((y) => (
                    <td key={y.year} className="border-b border-slate-100 px-2 py-2">
                      {y.income.toLocaleString("en-US")}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="pt-4">
          <Button disabled className="opacity-70" title="قريباً">
            تحميل ملخص حصتي PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
