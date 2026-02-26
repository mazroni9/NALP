import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ZoneBPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/asset-zones" className="text-sm text-indigo-600 hover:underline">
        ← Back to Zones
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">
        Zone B: Auto Services
      </h1>
      <p className="mt-2 text-slate-600">
        Automotive services, auctions, and storage facilities.
      </p>
      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Services & Storage</h2>
          <p className="mt-2 text-slate-600">
            Zone B supports automotive retail, maintenance, auction activities,
            and storage—creating synergies with the residential workforce in
            Zone A and serving the broader Jubail–Dammam corridor demand.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Key Features</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
            <li>Automotive services and maintenance</li>
            <li>Vehicle auctions</li>
            <li>Storage and logistics facilities</li>
            <li>Strategic corridor location</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
