import PublicLayout from '@/Layouts/PublicLayout';
import { useForm } from '@inertiajs/react';

export default function Contact() {
    const contactForm = useForm({
        name: '',
        email: '',
        company: '',
        message: '',
        type: 'contact',
    });
    const ndaForm = useForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        purpose: '',
    });
    const dataRoomForm = useForm({
        name: '',
        email: '',
        company: '',
        message: '',
        type: 'data_room_access',
    });

    return (
        <PublicLayout title="Contact - NALP">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-800">Contact</h1>
                <p className="mt-2 text-slate-600">Get in touch or request access.</p>
                <div className="mt-12 space-y-12">
                    <section className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-xl font-semibold">General Inquiry</h2>
                        <form onSubmit={(e) => { e.preventDefault(); contactForm.post(route('contact.submit')); }} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Name</label>
                                <input type="text" value={contactForm.data.name} onChange={e => contactForm.setData('name', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                                {contactForm.errors.name && <p className="mt-1 text-sm text-red-600">{contactForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input type="email" value={contactForm.data.email} onChange={e => contactForm.setData('email', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                                {contactForm.errors.email && <p className="mt-1 text-sm text-red-600">{contactForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Company</label>
                                <input type="text" value={contactForm.data.company} onChange={e => contactForm.setData('company', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Message</label>
                                <textarea value={contactForm.data.message} onChange={e => contactForm.setData('message', e.target.value)} rows={4} className="mt-1 w-full rounded-md border-slate-300" />
                            </div>
                            <button type="submit" disabled={contactForm.processing} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">Submit</button>
                        </form>
                    </section>
                    <section className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-xl font-semibold">Request NDA</h2>
                        <form onSubmit={(e) => { e.preventDefault(); ndaForm.post(route('contact.nda')); }} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Name</label>
                                <input type="text" value={ndaForm.data.name} onChange={e => ndaForm.setData('name', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input type="email" value={ndaForm.data.email} onChange={e => ndaForm.setData('email', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Company</label>
                                <input type="text" value={ndaForm.data.company} onChange={e => ndaForm.setData('company', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Phone</label>
                                <input type="tel" value={ndaForm.data.phone} onChange={e => ndaForm.setData('phone', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Purpose</label>
                                <textarea value={ndaForm.data.purpose} onChange={e => ndaForm.setData('purpose', e.target.value)} rows={2} className="mt-1 w-full rounded-md border-slate-300" />
                            </div>
                            <button type="submit" disabled={ndaForm.processing} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">Request NDA</button>
                        </form>
                    </section>
                    <section className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="text-xl font-semibold">Request Data Room Access</h2>
                        <form onSubmit={(e) => { e.preventDefault(); dataRoomForm.post(route('contact.data-room')); }} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Name</label>
                                <input type="text" value={dataRoomForm.data.name} onChange={e => dataRoomForm.setData('name', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input type="email" value={dataRoomForm.data.email} onChange={e => dataRoomForm.setData('email', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Company</label>
                                <input type="text" value={dataRoomForm.data.company} onChange={e => dataRoomForm.setData('company', e.target.value)} className="mt-1 w-full rounded-md border-slate-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Message</label>
                                <textarea value={dataRoomForm.data.message} onChange={e => dataRoomForm.setData('message', e.target.value)} rows={4} className="mt-1 w-full rounded-md border-slate-300" />
                            </div>
                            <button type="submit" disabled={dataRoomForm.processing} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">Request Access</button>
                        </form>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
