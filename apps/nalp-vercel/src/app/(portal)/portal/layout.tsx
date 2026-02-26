import Link from "next/link";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <Link href="/portal" className="mb-6 font-bold text-indigo-600">
            NALP Portal
          </Link>
          <nav className="flex flex-1 flex-col gap-1">
            <Link
              href="/portal/dashboard"
              className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <Link
              href="/portal/data-room"
              className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              Data Room
            </Link>
            <Link
              href="/portal/scenarios"
              className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              Scenarios
            </Link>
          </nav>
          <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600">
            ← Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
