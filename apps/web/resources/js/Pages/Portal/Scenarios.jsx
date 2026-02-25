import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Scenarios({ scenarios = [] }) {
    const [compareA, setCompareA] = useState(null);
    const [compareB, setCompareB] = useState(null);
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

    const a = scenarios.find(s => s.id === compareA);
    const b = scenarios.find(s => s.id === compareB);

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
                            <div className="mt-4 flex gap-4">
                                <select value={compareA || ''} onChange={e => setCompareA(Number(e.target.value) || null)} className="rounded-md border-slate-300">
                                    <option value="">Select A</option>
                                    {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <select value={compareB || ''} onChange={e => setCompareB(Number(e.target.value) || null)} className="rounded-md border-slate-300">
                                    <option value="">Select B</option>
                                    {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            {a && b && (
                                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-slate-500">Occupancy:</span> {a.occupancy}% vs {b.occupancy}%</div>
                                    <div><span className="text-slate-500">Bed rate:</span> {a.bed_rate} vs {b.bed_rate}</div>
                                    <div><span className="text-slate-500">OPEX cap:</span> {a.opex_cap} vs {b.opex_cap}</div>
                                    <div><span className="text-slate-500">Land exit:</span> {a.land_exit_price} vs {b.land_exit_price}</div>
                                </div>
                            )}
                        </section>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold">Saved Scenarios</h2>
                        <div className="mt-4 space-y-2">
                            {scenarios.map(s => (
                                <div key={s.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                                    <span>{s.name}</span>
                                    <span className="text-sm text-slate-500">Occ: {s.occupancy}% | Bed: {s.bed_rate}</span>
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
