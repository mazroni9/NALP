"use client";

/**
 * اسكتش تخطيط الغرف داخل المبنى:
 * غرفة 5م عرض × 7م عمق، منطقة درج 3.5م
 * العرض الكلي ≤ 52.5م
 */
const ROOM_WIDTH_M = 5;
const STAIR_WIDTH_M = 3.5;
const ROOM_DEPTH_M = 7;
const MAX_WIDTH_M = 52.5;

export function RoomLayoutSketch() {
  const roomCount = Math.floor((MAX_WIDTH_M - STAIR_WIDTH_M) / ROOM_WIDTH_M);
  const usedWidth = roomCount * ROOM_WIDTH_M + STAIR_WIDTH_M;

  const scale = 8;
  const totalW = usedWidth * scale;
  const totalH = ROOM_DEPTH_M * scale * 2 + 12;

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
        <h3 className="text-sm font-semibold text-slate-700">
          تخطيط وحدة سكنية (عمق 7م، غرفة 5م، درج 3.5م)
        </h3>
      </div>
      <svg
        viewBox={`0 0 ${totalW + 40} ${totalH + 40}`}
        className="w-full max-h-[220px]"
      >
        <g transform="translate(20, 20)">
          {/* الطابق الأرضي */}
          <rect
            x={0}
            y={0}
            width={totalW}
            height={ROOM_DEPTH_M * scale}
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth={1}
          />
          {Array.from({ length: roomCount }).map((_, i) => (
            <g key={`g${i}`}>
              <rect
                x={i * ROOM_WIDTH_M * scale}
                y={0}
                width={ROOM_WIDTH_M * scale - 1}
                height={ROOM_DEPTH_M * scale - 1}
                fill="#fde68a"
                stroke="#d97706"
                strokeWidth={1}
              />
              <text
                x={i * ROOM_WIDTH_M * scale + (ROOM_WIDTH_M * scale) / 2}
                y={(ROOM_DEPTH_M * scale) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-700 text-xs font-medium"
              >
                {i + 1}
              </text>
            </g>
          ))}
          <rect
            x={roomCount * ROOM_WIDTH_M * scale}
            y={0}
            width={STAIR_WIDTH_M * scale - 1}
            height={ROOM_DEPTH_M * scale - 1}
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={roomCount * ROOM_WIDTH_M * scale + (STAIR_WIDTH_M * scale) / 2}
            y={(ROOM_DEPTH_M * scale) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600 text-xs font-semibold"
          >
            درج
          </text>

          {/* خط فاصل بين الطابقين */}
          <line
            x1={0}
            y1={ROOM_DEPTH_M * scale + 6}
            x2={totalW}
            y2={ROOM_DEPTH_M * scale + 6}
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="2 2"
          />

          {/* الطابق العلوي */}
          <rect
            x={0}
            y={ROOM_DEPTH_M * scale + 12}
            width={totalW}
            height={ROOM_DEPTH_M * scale}
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth={1}
          />
          {Array.from({ length: roomCount }).map((_, i) => (
            <g key={`u${i}`}>
              <rect
                x={i * ROOM_WIDTH_M * scale}
                y={ROOM_DEPTH_M * scale + 12}
                width={ROOM_WIDTH_M * scale - 1}
                height={ROOM_DEPTH_M * scale - 1}
                fill="#fde68a"
                stroke="#d97706"
                strokeWidth={1}
              />
              <text
                x={i * ROOM_WIDTH_M * scale + (ROOM_WIDTH_M * scale) / 2}
                y={ROOM_DEPTH_M * scale + 12 + (ROOM_DEPTH_M * scale) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-700 text-xs font-medium"
              >
                {i + 1}
              </text>
            </g>
          ))}
          <rect
            x={roomCount * ROOM_WIDTH_M * scale}
            y={ROOM_DEPTH_M * scale + 12}
            width={STAIR_WIDTH_M * scale - 1}
            height={ROOM_DEPTH_M * scale - 1}
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={roomCount * ROOM_WIDTH_M * scale + (STAIR_WIDTH_M * scale) / 2}
            y={ROOM_DEPTH_M * scale + 12 + (ROOM_DEPTH_M * scale) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600 text-xs font-semibold"
          >
            درج
          </text>

          {/* تسميات الطوابق */}
          <text x={-8} y={(ROOM_DEPTH_M * scale) / 2} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-xs">
            أرضي
          </text>
          <text x={-8} y={ROOM_DEPTH_M * scale + 12 + (ROOM_DEPTH_M * scale) / 2} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-xs">
            علوي
          </text>
        </g>
      </svg>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm text-slate-600">
        عرض الغرفة 5م | منطقة الدرج 3.5م | العمق 7م | المستخدم {usedWidth}م من 52.5م
      </div>
    </div>
  );
}

