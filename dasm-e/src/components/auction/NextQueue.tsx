import { Link } from 'react-router-dom'
import type { Lot } from '@/types'

interface NextQueueProps {
  queue: Lot[]
}

export function NextQueue({ queue }: NextQueueProps) {
  if (queue.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
        لا يوجد لوت قادم
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 font-bold text-slate-900">القادمة (5)</h3>
      <ul className="space-y-2">
        {queue.map((lot) => (
          <li key={lot.id}>
            <Link
              to={`/lot/${lot.id}`}
              className="block rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
            >
              <div className="flex justify-between">
                <span className="font-medium text-slate-800">{lot.lotNumber}</span>
                <span className="text-slate-500">{lot.currentPrice.toLocaleString('ar-SA')} ر.س</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{lot.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
