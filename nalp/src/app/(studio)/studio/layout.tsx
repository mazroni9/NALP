import Link from "next/link";

const LEGAL_BANNER =
  "جميع المخرجات المولدة بالذكاء الاصطناعي هي تصاميم مفهومية أولية وليست صالحة للتنفيذ. المخططات الهندسية النهائية تتطلب اعتماد مهندس مرخّص.";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-900">
        {LEGAL_BANNER}
      </div>
      <nav className="border-b border-slate-200 bg-white pt-12">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="font-bold text-indigo-600">
            استوديو NALP
          </Link>
          <Link href="/portal" className="text-slate-600 hover:text-indigo-600">
            البوابة
          </Link>
        </div>
      </nav>
      <div className="pt-2">{children}</div>
    </div>
  );
}
