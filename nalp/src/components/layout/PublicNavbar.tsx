import Link from "next/link";

export function PublicNavbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600">
            <span className="text-xl">NALP</span>
            <span className="hidden text-sm font-normal text-slate-500 sm:inline">
              مجمع النابية للسيارات والخدمات اللوجستية
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/asset-zones" className="text-slate-600 hover:text-indigo-600">
              المناطق
            </Link>
            <Link href="/financials" className="text-slate-600 hover:text-indigo-600">
              الجدوى المالية
            </Link>
            <Link href="/location" className="text-slate-600 hover:text-indigo-600">
              الموقع
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-indigo-600">
              تواصل
            </Link>
            <Link
              href="/portal"
              className="rounded-md bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
            >
              بوابة المستثمر
            </Link>
            <Link
              href="/studio"
              className="rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-200"
            >
              استوديو التصميم
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
