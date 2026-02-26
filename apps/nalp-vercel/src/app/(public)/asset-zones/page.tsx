import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AssetZonesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800">Asset Zones</h1>
      <p className="mt-2 text-slate-600">
        NALP comprises two distinct zones designed for complementary uses.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Link href="/asset-zones/zone-a-workforce-housing">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-xl font-semibold text-indigo-600">
              Zone A: Workforce Housing
            </h2>
            <p className="mt-2 text-slate-600">
              G+2 residential concept for workforce accommodation with modern
              amenities.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
              Learn more →
            </span>
          </Card>
        </Link>
        <Link href="/asset-zones/zone-b-auto-services">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-xl font-semibold text-indigo-600">
              Zone B: Auto Services
            </h2>
            <p className="mt-2 text-slate-600">
              Automotive services, auctions, and storage facilities.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
              Learn more →
            </span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
