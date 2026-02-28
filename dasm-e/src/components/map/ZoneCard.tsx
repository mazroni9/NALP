import { zones } from '@/mock'
import { Badge } from '@/components/ui/Badge'

const ZONE_COLORS: Record<string, string> = {
  a: 'bg-indigo-100 text-indigo-800',
  b: 'bg-emerald-100 text-emerald-800',
  c: 'bg-amber-100 text-amber-800',
  d: 'bg-violet-100 text-violet-800',
}

interface ZoneCardProps {
  zoneId: string
}

export function ZoneCard({ zoneId }: ZoneCardProps) {
  const zone = zones.find((z) => z.id === zoneId)
  if (!zone) return null

  return (
    <div
      id={`zone-${zoneId}`}
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <Badge className={ZONE_COLORS[zoneId] ?? ''}>{zone.id.toUpperCase()}</Badge>
        <span className="text-sm text-slate-500">
          {zone.widthM}×{zone.depthM} م
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-slate-900">{zone.nameAr}</h3>
      <p className="mt-1 text-slate-600">
        {zone.id === 'a' && 'منصة المزاد ومنطقة العرض'}
        {zone.id === 'b' && 'ساحة إيواء المركبات'}
        {zone.id === 'c' && 'سكن الموظفين والمرافق'}
        {zone.id === 'd' && 'ورش ومغاسل وخدمات'}
      </p>
    </div>
  )
}
