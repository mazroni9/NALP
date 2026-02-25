import PublicLayout from '@/Layouts/PublicLayout';

export default function ZoneBAutoServices() {
    return (
        <PublicLayout title="Zone B - Auto Services">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-800">Zone B: Auto Services / Auctions / Storage</h1>
                <p className="mt-2 text-slate-600">Integrated automotive and logistics facilities.</p>
                <div className="mt-8 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Auto Services</h2>
                        <p className="mt-2 text-slate-600">Maintenance, repairs, and automotive support services.</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Auctions</h2>
                        <p className="mt-2 text-slate-600">Vehicle auction facilities for wholesale and retail transactions.</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Storage</h2>
                        <p className="mt-2 text-slate-600">Secure storage solutions for vehicles and logistics.</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
