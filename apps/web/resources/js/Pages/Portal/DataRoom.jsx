import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DataRoom() {
    const { auth } = usePage().props;
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/data-room/documents', { withCredentials: true })
            .then(res => setDocuments(res.data.documents || []))
            .catch(() => setDocuments({}))
            .finally(() => setLoading(false));
    }, []);

    const download = (id) => {
        window.open(`/api/data-room/documents/${id}/download`, '_blank');
    };

    const flat = Array.isArray(documents) ? documents : [];
    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-slate-800">Data Room</h1>
                    <p className="mt-1 text-slate-600">Documents and files by category.</p>
                    {loading ? (
                        <p className="mt-8 text-slate-500">Loading...</p>
                    ) : flat.length === 0 ? (
                        <p className="mt-8 text-slate-500">No documents yet.</p>
                    ) : (
                        <div className="mt-8 space-y-4">
                            {flat.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                                    <div>
                                        <p className="font-medium">{doc.name}</p>
                                        {doc.description && <p className="text-sm text-slate-500">{doc.description}</p>}
                                    </div>
                                    <button onClick={() => download(doc.id)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">Download</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
