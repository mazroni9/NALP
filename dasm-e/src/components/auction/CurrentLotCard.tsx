import type { Lot } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface CurrentLotCardProps {
  lot: Lot | null
  lockTimer?: number
}

export function CurrentLotCard({ lot, lockTimer }: CurrentLotCardProps) {
  if (!lot) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
        لا يوجد لوت حالياً
      </div>
    )
  }

  const statusVariant = lot.status === 'OPEN' ? 'success' : lot.status === 'LOCKED' ? 'warning' : 'default'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <Badge variant={statusVariant}>
          {lot.status === 'OPEN' ? 'مفتوح' : lot.status === 'LOCKED' ? 'مقفل' : 'مباع'}
        </Badge>
        <span className="text-sm text-slate-500">
          {lot.locationZone} / بلوك {lot.locationBlock}
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">{lot.title}</h2>
      <p className="text-slate-600">{lot.lotNumber} • {lot.year}</p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-indigo-600">
          {lot.currentPrice.toLocaleString('ar-SA')}
        </span>
        <span className="text-slate-500">ر.س</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        الحد الأدنى للمزايدة: +{lot.minIncrement.toLocaleString('ar-SA')} ر.س
      </p>
      {lot.status === 'LOCKED' && lockTimer !== undefined && lockTimer > 0 && (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-amber-800">
          يُفتح بعد {Math.ceil(lockTimer / 60)} دقيقة
        </div>
      )}
    </div>
  )
}
