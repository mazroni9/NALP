import { Head, Link, usePage } from '@inertiajs/react';

export default function PublicLayout({ children, title = 'NALP' }) {
    const { auth, csrf_token } = usePage().props;
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <nav className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600">
                                <span className="text-xl">NALP</span>
                                <span className="hidden text-sm font-normal text-slate-500 sm:inline">Nabiyah Automotive & Logistics Park</span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <Link href="/asset/zones" className="text-slate-600 hover:text-indigo-600">Zones</Link>
                                <Link href="/financials" className="text-slate-600 hover:text-indigo-600">Financials</Link>
                                <Link href="/location" className="text-slate-600 hover:text-indigo-600">Location</Link>
                                <Link href="/contact" className="text-slate-600 hover:text-indigo-600">Contact</Link>
                                {auth?.user ? (
                                    <>
                                        <Link href="/portal" className="rounded-md bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200">Portal</Link>
                                        <Link href="/studio" className="rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-200">Design Studio</Link>
                                        <form method="POST" action={route('logout')} className="inline">
                                            <input type="hidden" name="_token" value={csrf_token} />
                                            <button type="submit" className="text-slate-600 hover:text-slate-800">Logout</button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-slate-600 hover:text-indigo-600">Login</Link>
                                        <Link href={route('register')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
                <main>{children}</main>
                <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Nabiyah Automotive & Logistics Park. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
