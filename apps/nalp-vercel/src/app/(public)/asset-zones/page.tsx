import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AssetZonesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">مناطق الأصول</h1>
      <p className="mt-2 text-slate-600">
        يتكون NALP من منطقتين متميزتين مصممتين لاستخدامات متكاملة.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Link href="/asset-zones/zone-a-workforce-housing">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-xl font-semibold text-indigo-600">
              المنطقة أ: إسكان العمالة
            </h2>
            <p className="mt-2 text-slate-600">
              مفهوم سكني G+2 لإيواء العمالة مع مرافق حديثة.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
              اعرف المزيد ←
            </span>
          </Card>
        </Link>
        <Link href="/asset-zones/zone-b-auto-services">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-xl font-semibold text-indigo-600">
              المنطقة ب: خدمات السيارات
            </h2>
            <p className="mt-2 text-slate-600">
              خدمات السيارات والمزادات ومرافق التخزين.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
              اعرف المزيد ←
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
