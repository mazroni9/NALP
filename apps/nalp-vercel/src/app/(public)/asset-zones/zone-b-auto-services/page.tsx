import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ZoneBPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        → العودة للمناطق
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        المنطقة ب: خدمات السيارات
      </h1>
      <p className="mt-2 text-slate-600">
        خدمات السيارات والمزادات ومرافق التخزين.
      </p>
      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">الخدمات والتخزين</h2>
          <p className="mt-2 text-slate-600">
            تدعم المنطقة ب تجارة السيارات والصيانة وأنشطة المزادات
            والتخزين—مما يخلق تكافلاً مع العمالة السكنية في المنطقة أ وخدمة
            الطلب الأوسع في محور الجبيل–الظهران.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">المميزات الرئيسية</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>خدمات وصيانة السيارات</li>
            <li>مزادات المركبات</li>
            <li>مرافق التخزين واللوجستيات</li>
            <li>موقع استراتيجي على المحور</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
