import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ZONE_CONFIGS } from "@/lib/nalpLandSketch";

const ZONE_SLUGS: Record<string, string> = {
  a: "zone-a",
  b: "zone-b",
  c: "zone-c",
  d: "zone-d",
};

export default function AssetZonesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">مناطق الأصول</h1>
      <p className="mt-2 text-slate-600">
        يتكون NALP من أربع مناطق متميزة مصممة لاستخدامات متكاملة.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {ZONE_CONFIGS.map((zone) => (
          <Link key={zone.id} href={`/asset-zones/${ZONE_SLUGS[zone.id]}`}>
            <Card className="h-full cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
              <h2 className="text-xl font-semibold text-indigo-600">
                المنطقة {zone.id.toUpperCase()}: {zone.title}
              </h2>
              <p className="mt-2 text-slate-600">{zone.shortDesc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                اعرف المزيد ←
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
