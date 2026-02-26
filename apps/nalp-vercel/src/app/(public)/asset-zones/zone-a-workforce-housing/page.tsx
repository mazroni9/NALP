import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ZoneAPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        → العودة للمناطق
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        المنطقة أ: إسكان العمالة
      </h1>
      <p className="mt-2 text-slate-600">
        مفهوم سكني مصمم لإيواء العمالة.
      </p>
      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">مفهوم G+2</h2>
          <p className="mt-2 text-slate-600">
            مفهوم أرضي + طابقين يوفّر وحدات حديثة مع مرافق مشتركة، وقرب من
            أماكن العمل الصناعية، وحلول إسكان فعّالة للعمالة.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">المميزات الرئيسية</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>أرضي + طابقان علويان</li>
            <li>قرب من خدمات السيارات في المنطقة ب</li>
            <li>مرافق ومرافق مشتركة</li>
            <li>مصمم لطلب العمالة الصناعية</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
