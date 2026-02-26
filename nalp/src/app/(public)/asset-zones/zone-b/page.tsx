import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ZONE_CONFIGS, ZONE_DIMENSIONS } from "@/lib/nalpLandSketch";
import { ZoneSketch } from "@/components/asset-zones/ZoneSketch";

const zone = ZONE_CONFIGS.find((z) => z.id === "b")!;
const dims = ZONE_DIMENSIONS.find((z) => z.id === "b")!;

export default function ZoneBPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        → العودة للمناطق
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        المنطقة ب: {zone.title}
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
            <li>تخزين السيارات قبل وبعد المزاد</li>
            <li>مواقف وممرات شاحنات السحب</li>
            <li>صفوف طولية بممرات مناسبة للمناورة</li>
            <li>إمكانية تقسيم الساحة إلى بلوكات بحسب نوع السيارات</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
