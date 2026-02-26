import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ZONE_CONFIGS, ZONE_DIMENSIONS } from "@/lib/nalpLandSketch";
import { ZoneSketch } from "@/components/asset-zones/ZoneSketch";

const zone = ZONE_CONFIGS.find((z) => z.id === "a")!;
const dims = ZONE_DIMENSIONS.find((z) => z.id === "a")!;

export default function ZoneAPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        → العودة للمناطق
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        المنطقة أ: {zone.title}
      </h1>
      <p className="mt-2 text-slate-600">{zone.shortDesc}</p>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">اسكتش الأبعاد والحدود</h2>
        <div className="mt-4">
          <ZoneSketch dims={dims} />
        </div>
      </Card>

      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">الوصف</h2>
          <p className="mt-2 text-slate-600">{zone.description}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">المميزات الرئيسية</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>واجهة المشروع على طريق الجبيل–الدمام</li>
            <li>منصة المزاد ومنطقة العرض المباشر</li>
            <li>مسارات حركة الجمهور والمزايدين</li>
            <li>سهولة دخول السيارات المعروضة وخروجها</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
