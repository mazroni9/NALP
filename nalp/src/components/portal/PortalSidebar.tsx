"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/portal/dashboard", label: "لوحة المستثمر" },
  { href: "/portal/investors", label: "حصة المستثمر" },
  { href: "/portal/data-room", label: "غرفة البيانات" },
  { href: "/portal/scenarios", label: "السيناريوهات" },
  { href: "/portal/partners", label: "لوحة الشركاء" },
  { href: "/portal/board", label: "لوحة المجلس" },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-e border-slate-200 bg-white" dir="rtl">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <Link href="/portal" className="mb-6 font-bold text-indigo-600">
          بوابة NALP
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <Link
            href="/financials"
            className="block text-xs text-slate-400 hover:text-indigo-600"
          >
            ← نظرة مالية عامة
          </Link>
          <Link
            href="/"
            className="mt-2 block text-xs text-slate-400 hover:text-indigo-600"
          >
            العودة للموقع الرئيسي
          </Link>
        </div>
      </div>
    </aside>
  );
}
