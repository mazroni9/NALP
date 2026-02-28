"use client";

import { Card } from "@/components/ui/Card";
import Link from "next/link";

const ASSUMPTIONS = [
  "مساحة الأرض الإجمالية: 33,800 م² — المساحة الصافية بعد استقطاع شارع مستقبلي (12.5 م × 520 م = 6,500 م²): 27,300 م² — لم يُعتمد الاستقطاع رسمياً بعد ولا يؤثر على التخطيط الحالي.",
  "مدة الشراكة: 8 سنوات",
  "Zone-B: 300 موقف، إشغال 70%، 30 ريال/يوم",
  "Zone-C: 198 غرفة، إشغال 80%، نصفها 1500 ونصفها 1150 ريال/شهر، OPEX 10%",
  "Zone-A: رسوم مزاد وفق جدول السنوات (سنة1: 5 سيارات/يوم… إلى سنة4-8: 20 سيارة/يوم)",
  "Zone-D: إيجار ثابت (لا مقاسمة)",
  "Cap Rate للتقييم: 9% (قابل للتغيير في المحاكي)",
];

export function AssumptionsPanel() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900">الافتراضات الرئيسية</h3>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-600">
        {ASSUMPTIONS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-500">
        مصدر Zone-C:{" "}
        <Link
          href="https://nalp.vercel.app/asset-zones/zone-c"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline hover:text-indigo-700"
        >
          nalp.vercel.app/asset-zones/zone-c
        </Link>
        {" "}(عدد الغرف/المساحات/تقدير التكلفة)
      </p>
    </Card>
  );
}
