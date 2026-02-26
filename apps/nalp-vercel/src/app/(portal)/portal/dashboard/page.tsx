import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function PortalDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Investor Portal</h1>
      <p className="mt-1 text-slate-600">
        Welcome to your dashboard. (TODO: Auth will be added later)
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link href="/portal/data-room">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-lg font-semibold text-indigo-600">Data Room</h2>
            <p className="mt-2 text-slate-600">Browse and download documents.</p>
          </Card>
        </Link>
        <Link href="/portal/scenarios">
          <Card className="cursor-pointer transition hover:border-indigo-200 hover:shadow-md">
            <h2 className="text-lg font-semibold text-indigo-600">Scenarios</h2>
            <p className="mt-2 text-slate-600">
              Create and compare financial scenarios.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
