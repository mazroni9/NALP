import PublicLayout from '@/Layouts/PublicLayout';

export default function Location() {
    return (
        <PublicLayout title="Location - NALP">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-800">Location</h1>
                <p className="mt-2 text-slate-600">Strategic positioning on the Jubail–Dammam corridor.</p>
                <div className="mt-8 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-lg font-semibold">Jubail–Dammam Axis</h2>
                        <p className="mt-2 text-slate-600">NALP is strategically situated along the vital Jubail–Dammam corridor, providing excellent connectivity to industrial zones, ports, and urban centers.</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
