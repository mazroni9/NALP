import PublicLayout from '@/Layouts/PublicLayout';

export default function ZoneA() {
    return (
        <PublicLayout title="Zone A - Workforce Housing">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-800">Zone A: Workforce Housing</h1>
                <p className="mt-2 text-slate-600">G+2 concept with premium rooms and occupancy assumptions.</p>
                <div className="mt-8 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Concept</h2>
                        <p className="mt-2 text-slate-600">Ground + 2 floors residential concept targeting industrial workforce with premium room configurations.</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Occupancy Assumptions</h2>
                        <ul className="mt-2 list-inside list-disc text-slate-600">
                            <li>Target occupancy rate based on market analysis</li>
                            <li>Bed rate assumptions aligned with regional benchmarks</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
