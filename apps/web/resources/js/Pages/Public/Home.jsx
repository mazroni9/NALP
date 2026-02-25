import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

export default function Home({ keyNumbers = [] }) {
    const numbers = keyNumbers.length ? keyNumbers : [
        { label: 'Total Land Area', value: '33,000 m²' },
        { label: 'Zones', value: '2' },
        { label: 'Zone A (Housing)', value: 'G+2 Concept' },
        { label: 'Zone B (Auto)', value: 'Services & Storage' },
    ];
    return (
        <PublicLayout title="Home - NALP">
            <div className="relative">
                <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-4 py-24 text-white sm:py-32">
                    <div className="mx-auto max-w-7xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Nabiyah Automotive & Logistics Park</h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">A premier mixed-use development combining workforce housing with automotive services, auctions, and storage—strategically located on the Jubail–Dammam corridor.</p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link href="/asset/zones" className="inline-flex rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-indigo-50">Explore Zones</Link>
                            <Link href="/contact" className="inline-flex rounded-md border-2 border-white px-6 py-3 text-base font-medium text-white hover:bg-white/10">Request NDA</Link>
                        </div>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-4 py-16">
                    <h2 className="text-center text-2xl font-bold text-slate-800">Key Numbers</h2>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {numbers.map((item, i) => (
                            <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                                <p className="mt-2 text-2xl font-bold text-indigo-600">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="border-t border-slate-200 bg-slate-100 px-4 py-16">
                    <div className="mx-auto max-w-7xl text-center">
                        <h2 className="text-2xl font-bold text-slate-800">Investor Portal & Design Studio</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-600">Access the Data Room, run financial scenarios, and design land layouts with our AI-assisted Design Studio.</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link href={route('login')} className="inline-flex rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700">Login to Portal</Link>
                            <Link href="/studio" className="inline-flex rounded-md border-2 border-indigo-600 px-6 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50">Design Studio</Link>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
