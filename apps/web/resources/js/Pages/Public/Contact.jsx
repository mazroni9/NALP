import PublicLayout from '@/Layouts/PublicLayout';
import { useForm, usePage } from '@inertiajs/react';

export default function Contact() {
    const { flash } = usePage().props;
    const form = useForm({
        name: '',
        email: '',
        message: '',
        request_nda: false,
        request_type: 'contact',
    });

    return (
        <PublicLayout title="Contact - NALP">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-800">Contact</h1>
                <p className="mt-2 text-slate-600">Get in touch or request access.</p>
                <form onSubmit={(e) => { e.preventDefault(); form.post(route('contact.submit')); }} className="mt-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Name *</label>
                            <input type="text" value={form.data.name} onChange={e => form.setData('name', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email *</label>
                            <input type="email" value={form.data.email} onChange={e => form.setData('email', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                            {form.errors.email && <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Message</label>
                            <textarea value={form.data.message} onChange={e => form.setData('message', e.target.value)} rows={4} className="mt-1 w-full rounded-md border-slate-300" />
                            {form.errors.message && <p className="mt-1 text-sm text-red-600">{form.errors.message}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={form.data.request_nda} onChange={e => form.setData('request_nda', e.target.checked)} className="rounded border-slate-300" />
                                <span className="text-sm font-medium text-slate-700">Request NDA</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Request Type</label>
                            <select value={form.data.request_type} onChange={e => form.setData('request_type', e.target.value)} className="mt-1 w-full rounded-md border-slate-300">
                                <option value="contact">General Contact</option>
                                <option value="nda">NDA Request</option>
                                <option value="data_room">Data Room Access</option>
                            </select>
                            {form.errors.request_type && <p className="mt-1 text-sm text-red-600">{form.errors.request_type}</p>}
                        </div>
                        <button type="submit" disabled={form.processing} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
                            {form.processing ? 'Submitting...' : 'Submit'}
                        </button>
                        {flash?.success && <p className="text-sm text-green-600">{flash.success}</p>}
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
