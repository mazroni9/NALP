import PublicLayout from '@/Layouts/PublicLayout';

export default function Financials() {
    return (
        <PublicLayout title="Financials - NALP">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-800">Financial Overview</h1>
                <p className="mt-2 text-slate-600">Simplified financial metrics and assumptions.</p>
                <div className="mt-8 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Key Assumptions</h2>
                        <ul className="mt-4 space-y-2 text-slate-600">
                            <li>• Occupancy rates</li>
                            <li>• Bed rate (SAR)</li>
                            <li>• OPEX cap</li>
                            <li>• Land exit price assumptions</li>
                        </ul>
                    </div>
                    <p className="text-sm text-slate-500">For detailed financial models and scenario comparisons, log in to the Investor Portal.</p>
                </div>
            </div>
        </PublicLayout>
    );
}
