import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';

export default function Scenarios({ scenarios = [] }) {
    const form = useForm({
        name: '',
        occupancy: '',
        bed_rate: '',
        opex_cap: '',
        land_exit_price: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('portal.scenarios.store'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-slate-800">Scenarios</h1>
                    <p className="mt-1 text-slate-600">Save and compare financial assumptions.</p>
                    <div className="mt-8 grid gap-8 lg:grid-cols-2">
                        <section className="rounded-xl border border-slate-200 bg-white p-6">
                            <h2 className="text-lg font-semibold">New Scenario</h2>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <input type="text" placeholder="Name" value={form.data.name} onChange={e => form.setData('name', e.target.value)} className="w-full rounded-md border-slate-300" />
                                <input type="number" step="0.01" placeholder="Occupancy %" value={form.data.occupancy} onChange={e => form.setData('occupancy', e.target.value)} className="w-full rounded-md border-slate-300" />
                                <input type="number" step="0.01" placeholder="Bed rate (SAR)" value={form.data.bed_rate} onChange={e => form.setData('bed_rate', e.target.value)} className="w-full rounded-md border-slate-300" />
                                <input type="number" step="0.01" placeholder="OPEX cap" value={form.data.opex_cap} onChange={e => form.setData('opex_cap', e.target.value)} className="w-full rounded-md border-slate-300" />
                                <input type="number" step="0.01" placeholder="Land exit price" value={form.data.land_exit_price} onChange={e => form.setData('land_exit_price', e.target.value)} className="w-full rounded-md border-slate-300" />
                                <button type="submit" disabled={form.processing} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Save</button>
                            </form>
                        </section>
                        <section className="rounded-xl border border-slate-200 bg-white p-6">
                            <h2 className="text-lg font-semibold">Compare Scenarios</h2>
                            <p className="mt-1 text-sm text-slate-600">Compare two scenarios side by side.</p>
                            <Link href={route('portal.scenarios.compare')} className="mt-4 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                Open Compare Page
                            </Link>
                        </section>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold">Saved Scenarios</h2>
                        <div className="mt-4 space-y-2">
                            {scenarios.map(s => (
                                <div key={s.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                                    <span>{s.name}</span>
                                    <span className="text-sm text-slate-500">
                                        {s.inputs?.occupancy != null && `Occ: ${s.inputs.occupancy}%`}
                                        {s.inputs?.occupancy != null && s.inputs?.bed_rate != null && ' | '}
                                        {s.inputs?.bed_rate != null && `Bed: ${s.inputs.bed_rate}`}
                                        {!s.inputs?.occupancy && !s.inputs?.bed_rate && '—'}
                                    </span>
                                </div>
                            ))}
                            {scenarios.length === 0 && <p className="text-slate-500">No scenarios yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
