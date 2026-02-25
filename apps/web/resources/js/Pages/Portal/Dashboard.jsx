import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function PortalDashboard({ scenarioCount = 0 }) {
    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-slate-800">Investor Portal</h1>
                    <p className="mt-1 text-slate-600">Welcome to your dashboard.</p>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <Link href={route('portal.data-room')} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-200 hover:shadow-md">
                            <h2 className="text-lg font-semibold text-indigo-600">Data Room</h2>
                            <p className="mt-2 text-slate-600">Browse and download documents.</p>
                        </Link>
                        <Link href={route('portal.scenarios')} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-200 hover:shadow-md">
                            <h2 className="text-lg font-semibold text-indigo-600">Scenarios</h2>
                            <p className="mt-2 text-slate-600">{scenarioCount} scenario(s) saved. Compare assumptions.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
