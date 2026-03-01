"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { safeCopyToClipboard, safeGetLocationHref } from "@/lib/safeStorage";

export function ShareBar() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    safeCopyToClipboard(safeGetLocationHref());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={copyLink} variant="outline">
          {copied ? "تم النسخ" : "نسخ رابط الصفحة"}
        </Button>
        <Button
          disabled
          variant="outline"
          title="قريبًا"
          className="cursor-not-allowed opacity-60"
        >
          تحميل التقرير PDF
        </Button>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        هذه الصفحة عامة ويمكن مشاركتها مباشرة مع المستثمرين.
      </p>
    </div>
  );
}
