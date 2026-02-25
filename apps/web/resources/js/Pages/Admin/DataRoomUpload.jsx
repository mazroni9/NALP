import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';

export default function DataRoomUpload({ categories = [], documents = [], flash }) {
    const form = useForm({
        name: '',
        description: '',
        category_id: '',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('admin.data-room.upload'), {
            forceFormData: true,
        });
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        form.setData('file', file);
    };

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-slate-800">Data Room - Admin Upload</h1>
                    <p className="mt-1 text-slate-600">Upload documents to the data room. Files are stored in storage/app/data-room.</p>
                    {flash?.success && <p className="mt-4 text-sm text-green-600">{flash.success}</p>}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Document Name *</label>
                            <input type="text" value={form.data.name} onChange={e => form.setData('name', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                            {form.errors.name && <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} rows={2} className="mt-1 w-full rounded-md border-slate-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Category</label>
                            <select value={form.data.category_id} onChange={e => form.setData('category_id', e.target.value)} className="mt-1 w-full rounded-md border-slate-300">
                                <option value="">None</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">File *</label>
                            <input type="file" onChange={onFileChange} className="mt-1 w-full" required />
                            {form.errors.file && <p className="mt-1 text-sm text-red-600">{form.errors.file}</p>}
                        </div>
                        <button type="submit" disabled={form.processing} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
                            {form.processing ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold">Documents</h2>
                        <div className="mt-4 space-y-2">
                            {documents.map(d => (
                                <div key={d.id} className="rounded-lg border border-slate-200 bg-white p-4">
                                    <span className="font-medium">{d.name}</span>
                                    {d.versions?.length > 0 && <span className="ml-2 text-sm text-slate-500">({d.versions.length} version(s))</span>}
                                </div>
                            ))}
                            {documents.length === 0 && <p className="text-slate-500">No documents yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
