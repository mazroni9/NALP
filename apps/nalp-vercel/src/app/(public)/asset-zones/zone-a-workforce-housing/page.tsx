import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ZoneAPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        ← Back to Zones
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        Zone A: Workforce Housing
      </h1>
      <p className="mt-2 text-slate-600">
        Residential concept designed for workforce accommodation.
      </p>
      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">G+2 Concept</h2>
          <p className="mt-2 text-slate-600">
            A ground-plus-two structure concept offering modern units with
            shared amenities, proximity to industrial employment, and
            cost-effective housing solutions for the workforce.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Key Features</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>Ground floor + 2 upper floors</li>
            <li>Proximity to Zone B automotive services</li>
            <li>Shared amenities and utilities</li>
            <li>Designed for industrial workforce demand</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
