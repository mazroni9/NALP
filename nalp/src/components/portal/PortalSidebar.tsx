"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/portal/dashboard", label: "لوحة المستثمر" },
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
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 ${
                  isActive
                    ? "bg-indigo-50 font-medium text-indigo-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-slate-200 pt-4">
          <Link
            href="/financials"
            className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
          >
            نظرة مالية عامة ←
          </Link>
          <Link
            href="/"
            className="block text-sm text-slate-500 hover:text-indigo-600"
          >
            العودة للموقع الرئيسي
          </Link>
        </div>
      </div>
    </aside>
  );
}
