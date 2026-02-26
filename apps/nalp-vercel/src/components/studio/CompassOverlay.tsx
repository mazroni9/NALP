"use client";

/**
 * بوصلة تُظهر اتجاهات الأماكن (شمال، جنوب، شرق، غرب)
 */
export function CompassOverlay() {
  return (
    <div
      className="absolute bottom-4 left-4 z-10 rounded-full border-2 border-slate-300 bg-white/90 p-2 shadow-md"
      style={{ width: 56, height: 56 }}
      title="ش شمال · ج جنوب · ق شرق · غ غرب"
    >
      <div className="relative h-full w-full">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-0.5 text-xs font-bold text-red-600">
          ش
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0.5 text-xs font-bold text-slate-600">
          ج
        </span>
        <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 text-xs font-bold text-slate-600">
          غ
        </span>
        <span className="absolute right-0 top-1/2 translate-x-0.5 -translate-y-1/2 text-xs font-bold text-slate-600">
          ق
        </span>
      </div>
    </div>
  );
}
