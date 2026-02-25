import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CompareScenarios({ scenarios = [] }) {
    const [idA, setIdA] = useState('');
    const [idB, setIdB] = useState('');

    const a = scenarios.find(s => String(s.id) === idA);
    const b = scenarios.find(s => String(s.id) === idB);
    const inputsA = a?.inputs || {};
    const inputsB = b?.inputs || {};

    const allKeys = [...new Set([...Object.keys(inputsA), ...Object.keys(inputsB)])];

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-800">Compare Scenarios</h1>
                        <Link href={route('portal.scenarios')} className="text-indigo-600 hover:underline">← Back to Scenarios</Link>
                    </div>
                    <p className="mt-1 text-slate-600">Compare two scenarios side by side.</p>
                    <div className="mt-8 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700">Scenario A</label>
                            <select value={idA} onChange={e => setIdA(e.target.value)} className="mt-1 w-full rounded-md border-slate-300">
                                <option value="">Select scenario...</option>
                                {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700">Scenario B</label>
                            <select value={idB} onChange={e => setIdB(e.target.value)} className="mt-1 w-full rounded-md border-slate-300">
                                <option value="">Select scenario...</option>
                                {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {a && b && (
                        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                    <tr>
                                        <th className="bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700">Metric</th>
                                        <th className="bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700">{a.name}</th>
                                        <th className="bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700">{b.name}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allKeys.map(key => (
                                        <tr key={key} className="border-t border-slate-100">
                                            <td className="px-4 py-2 text-sm text-slate-600">{key.replace(/_/g, ' ')}</td>
                                            <td className="px-4 py-2 text-sm">{inputsA[key] ?? '—'}</td>
                                            <td className="px-4 py-2 text-sm">{inputsB[key] ?? '—'}</td>
                                        </tr>
                                    ))}
                                    {allKeys.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No inputs to compare</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
