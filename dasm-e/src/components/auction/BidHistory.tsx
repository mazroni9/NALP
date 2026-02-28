import type { BidRecord } from '@/store/auctionStore'

interface BidHistoryProps {
  history: BidRecord[]
}

export function BidHistory({ history }: BidHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        لا توجد مزايدات بعد
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 font-bold text-slate-900">آخر 10 مزايدات</h3>
      <ul className="space-y-2">
        {history.map((b, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span className="text-slate-600">
              {b.bidderNumber} ← {b.amount.toLocaleString('ar-SA')} ر.س
            </span>
            <span className="text-slate-400">{new Date(b.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
