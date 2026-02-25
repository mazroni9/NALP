import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

export default function AssetZonesOverview() {
    return (
        <PublicLayout title="Asset Zones - NALP">
            <div className="mx-auto max-w-7xl px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-800">Asset Zones Overview</h1>
                <p className="mt-2 text-slate-600">Two distinct zones designed for complementary use cases.</p>
                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-xl font-bold text-indigo-600">A</span>
                            <h2 className="text-2xl font-bold text-slate-800">Zone A: Workforce Housing</h2>
                        </div>
                        <ul className="mt-6 space-y-2 text-slate-600">
                            <li>• G+2 concept with premium rooms</li>
                            <li>• Optimized occupancy assumptions</li>
                            <li>• Designed for industrial workforce</li>
                        </ul>
                        <Link href="/asset/zone-a" className="mt-6 inline-flex text-indigo-600 hover:underline">Learn more →</Link>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-xl font-bold text-amber-700">B</span>
                            <h2 className="text-2xl font-bold text-slate-800">Zone B: Auto Services / Auctions / Storage</h2>
                        </div>
                        <ul className="mt-6 space-y-2 text-slate-600">
                            <li>• Auto services and maintenance</li>
                            <li>• Auction facilities</li>
                            <li>• Storage and logistics</li>
                        </ul>
                        <Link href="/asset/zone-b" className="mt-6 inline-flex text-indigo-600 hover:underline">Learn more →</Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
