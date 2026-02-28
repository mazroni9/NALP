import { Link } from 'react-router-dom'
import { zones } from '@/mock'

const ZONE_COLORS: Record<string, string> = {
  a: '#6366f1',
  b: '#10b981',
  c: '#f59e0b',
  d: '#8b5cf6',
}

interface ZoneMapProps {
  compact?: boolean
}

export function ZoneMap({ compact }: ZoneMapProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4"
      dir="ltr"
    >
      <div
        className="flex h-48"
        style={{ minHeight: compact ? 120 : 192 }}
      >
        {zones.map((zone) => (
          <Link
            key={zone.id}
            to={zone.link}
            className="flex flex-1 flex-col items-center justify-center transition-opacity hover:opacity-90"
            style={{
              flex: zone.widthM,
              backgroundColor: ZONE_COLORS[zone.id] ?? '#94a3b8',
              opacity: 0.85,
            }}
          >
            <span className="font-bold text-white drop-shadow">{zone.id.toUpperCase()}</span>
            <span className="mt-1 text-center text-xs text-white/90">
              {zone.nameAr}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
