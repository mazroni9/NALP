"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InvestorsError({ error }: ErrorProps) {
  const handleResetLedger = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("NALP_ZONE_A_LEDGER_V1");
    localStorage.removeItem("NALP_ZONE_A_MODE");
    location.reload();
  };

  const handleCopyError = async () => {
    const text = [error.message, error.stack].filter(Boolean).join("\n\n");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
      } catch {}
    }
  };

  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center p-6"
      dir="rtl"
    >
      <div className="max-w-md w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        <p className="text-slate-800 font-medium mb-6">
          حدث خطأ في صفحة المستثمر.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleResetLedger}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition"
          >
            إعادة تهيئة دفتر التشغيل
          </button>
          <button
            type="button"
            onClick={handleCopyError}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
          >
            نسخ تفاصيل الخطأ
          </button>
        </div>
      </div>
    </div>
  );
}
