import React from "react";

/**
 * مخطط تخطيط المنطقة أ — منطقة المزاد
 * 104م شرق-غرب، 52.5م شمال-جنوب
 * تدفق شمال→جنوب، منصة المزاد في المنتصف داخل منطقة تجميع للمخرج
 */
const WIDTH_M = 104;
const DEPTH_M = 52.5;
const GATE_WIDTH_M = 7;
const WEST_STRIP_M = 8.5;
const STREET_WIDTH_M = 12.5;

export function ZoneALayoutPlan() {
  const scale = 6;
  const w = WIDTH_M * scale;
  const h = DEPTH_M * scale;
  const gw = GATE_WIDTH_M * scale;
  const stripW = WEST_STRIP_M * scale;
  const streetH = STREET_WIDTH_M * scale;
  const pad = 50;
  const roadCenterX = stripW + gw / 2;
  const gateDepth = 2 * scale;

  const exitCenterX = stripW + gw / 2;
  const pathD = [
    "M", w - gateDepth / 2, gw / 2,
    "L", roadCenterX, gw / 2,
    "L", roadCenterX, h - gateDepth / 2,
    "L", exitCenterX, h - gateDepth / 2,
  ].join(" ");

  const vbW = w + pad * 2 + 40;
  const vbH = h + streetH * 2 + pad * 2 + 30;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full max-h-[560px] object-contain"
      >
        <defs>
          <marker id="arrow-entry" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
          </marker>
          <marker id="arrow-exit" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
          </marker>
        </defs>
        <g transform={`translate(${pad}, ${pad})`}>
          {/* المستطيل الرئيسي */}
          <rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill="#6366f1"
            fillOpacity={0.2}
            stroke="#6366f1"
            strokeWidth={2}
          />

          {/* شريط غربي 8.5 م × 52.5 م — مكاتب، كنترول روم، استراحة، بوفيه، مواقف */}
          <g>
            {/* خلفية الشريط — 8.5م عرض (أوسع من الطريق 7م) */}
            <rect x={0} y={0} width={stripW} height={h} fill="#f8fafc" stroke="#334155" strokeWidth={2} />
            {/* خط فاصل عمودي مع منطقة ب */}
            <line x1={0} y1={0} x2={0} y2={h} stroke="#334155" strokeWidth={2} />
            <line x1={stripW} y1={0} x2={stripW} y2={h} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
            {/* توزيع الأقسام — مكاتب 15%، كنترول روم 20%، استراحة 18%، بوفيه 17%، مواقف 30% */}
            {(() => {
              const sections = [
                { hRatio: 0.15, label: "مكاتب", fill: "#e0e7ff", stroke: "#818cf8" },
                { hRatio: 0.20, label: "كنترول روم", fill: "#dbeafe", stroke: "#3b82f6" },
                { hRatio: 0.18, label: "استراحة", fill: "#fef3c7", stroke: "#f59e0b" },
                { hRatio: 0.17, label: "بوفيه", fill: "#fce7f3", stroke: "#ec4899" },
                { hRatio: 0.30, label: "مواقف", fill: "#d1fae5", stroke: "#10b981" },
              ];
              let yAcc = 0;
              return sections.map((s, i) => {
                const sh = h * s.hRatio;
                const y = yAcc;
                yAcc += sh;
                return (
                  <g key={i}>
                    <rect x={1} y={y + 1} width={stripW - 2} height={sh - 2} fill={s.fill} fillOpacity={0.9} stroke={s.stroke} strokeWidth={1} />
                    {i < sections.length - 1 && (
                      <line x1={1} y1={y + sh} x2={stripW - 1} y2={y + sh} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 1" opacity={0.6} />
                    )}
                    <text x={stripW / 2} y={y + sh / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-800 text-[14px] font-bold">{s.label}</text>
                  </g>
                );
              });
            })()}
            {/* خطوط المواقف */}
            {(() => {
              const parkingTop = h * 0.70;
              const parkingH = h * 0.30;
              const lines = 4;
              const lineStep = parkingH / (lines + 1);
              return Array.from({ length: lines }).map((_, i) => (
                <line
                  key={i}
                  x1={2}
                  y1={parkingTop + lineStep * (i + 1)}
                  x2={stripW - 2}
                  y2={parkingTop + lineStep * (i + 1)}
                  stroke="#10b981"
                  strokeWidth={0.8}
                  strokeDasharray="3 2"
                  opacity={0.6}
                />
              ));
            })()}
            {/* بُعد الشريط — 8.5م (أوسع من الطريق 7م) */}
            <text x={stripW / 2} y={-4} textAnchor="middle" className="fill-slate-700 text-sm font-bold">8.5 م</text>
          </g>

          {/* طريق داخلي — عرض 7م بالنسب الحقيقية (7/104 ≈ 6.7٪ من القطعة) */}
          <path
            d={pathD}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={gw}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.6}
          />
          <path
            d={pathD}
            fill="none"
            stroke="#dc2626"
            strokeWidth={1}
            strokeDasharray="4 3"
            strokeOpacity={0.8}
            markerEnd="url(#arrow-exit)"
          />
          {/* أسهم اتجاه الحركة على الطريق مع ترقيم المراحل */}
          <path d={`M ${w - gateDepth - 30} ${gw / 2} L ${roadCenterX + 25} ${gw / 2}`} fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="8 4" markerEnd="url(#arrow-entry)" opacity={0.9} />
          <path d={`M ${roadCenterX} ${gw + 25} L ${roadCenterX} ${h - gateDepth - 25}`} fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="8 4" markerEnd="url(#arrow-entry)" opacity={0.9} />
          {/* مراحل مسار الدخول — دوائر مرقمة */}
          <circle cx={w - gateDepth - 15} cy={gw / 2} r={8} fill="#22c55e" stroke="#166534" strokeWidth={1.5} />
          <text x={w - gateDepth - 15} y={gw / 2} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[12px] font-bold">1</text>
          <text x={w - gateDepth - 15} y={gw / 2 + 30} textAnchor="middle" className="fill-green-800 text-[11px]">دخول</text>
          <circle cx={roadCenterX} cy={gw + 40} r={8} fill="#22c55e" stroke="#166534" strokeWidth={1.5} />
          <text x={roadCenterX} y={gw + 40} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[12px] font-bold">2</text>
          <text x={roadCenterX - 22} y={gw + 72} textAnchor="middle" className="fill-green-700 text-[11px]">طريق داخلي</text>

          {/* مدخل — زاوية شمال شرق */}
          <rect
            x={w - gateDepth}
            y={0}
            width={gateDepth}
            height={gw}
            fill="#dcfce7"
            fillOpacity={0.8}
            stroke="#22c55e"
            strokeWidth={1.5}
          />
          <text
            x={w - gateDepth / 2}
            y={gw / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-green-800 text-sm font-bold"
          >
            مدخل 7م
          </text>
          <text x={w - 65} y={gw / 2 - 22} textAnchor="middle" className="fill-green-700 text-[13px] font-semibold">← دخول السيارات</text>
          <text x={w + 15} y={gw / 2 - 24} textAnchor="start" className="fill-green-800 text-[12px]">سيارات قادمة</text>
          <text x={w + 15} y={gw / 2 + 24} textAnchor="start" className="fill-green-700 text-[11px]">من طريق الجبيل</text>

          {/* مخرج ١ — زاوية جنوب غرب */}
          <rect
            x={stripW}
            y={h - gateDepth}
            width={gw}
            height={gateDepth}
            fill="#fef3c7"
            fillOpacity={0.8}
            stroke="#f59e0b"
            strokeWidth={1.5}
          />
          <text
            x={stripW + gw / 2}
            y={h - gateDepth / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-amber-800 text-sm font-bold"
          >
            مخرج ١ (7م)
          </text>
          <text x={stripW + gw / 2} y={h - gateDepth - 16} textAnchor="middle" className="fill-amber-700 text-[13px] font-semibold">خروج ↓</text>
          {/* مخرج ٢ — جنوب شرق، على شارعنا */}
          <rect
            x={w - gw - 25}
            y={h - gateDepth}
            width={gw}
            height={gateDepth}
            fill="#fef3c7"
            fillOpacity={0.8}
            stroke="#f59e0b"
            strokeWidth={1.5}
          />
          <text
            x={w - gw / 2 - 25}
            y={h - gateDepth / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-amber-800 text-sm font-bold"
          >
            مخرج ٢ (7م)
          </text>
          <text x={w - gw / 2 - 25} y={h - gateDepth - 16} textAnchor="middle" className="fill-amber-700 text-[13px] font-semibold">خروج ↓</text>

          {/* الحدود والعناوين */}
          <line x1={0} y1={0} x2={w} y2={0} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text x={w / 2} y={-6} textAnchor="middle" className="fill-slate-700 text-base font-bold">
            شمال — 104 م
          </text>
          <text x={w / 2} y={-20} textAnchor="middle" className="fill-slate-500 text-sm">
            الحلفاء للسيراميك
          </text>

          <line x1={0} y1={h} x2={w} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />

          {/* شارعنا — 12.5 م (متناسق مع العمق 52.5 م) */}
          <rect x={0} y={h} width={w} height={streetH} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={1} />
          <line x1={w + 8} y1={h} x2={w + 8} y2={h + streetH} stroke="#64748b" strokeWidth={0.8} />
          <text x={w + 14} y={h + streetH / 2} textAnchor="start" dominantBaseline="middle" className="fill-slate-600 text-[14px] font-medium">12.5 م</text>
          <text x={w / 2} y={h + streetH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-base font-semibold">شارعنا 12.5 م</text>

          {/* شارع الجار — 12.5 م (نفس عرض شارعنا) */}
          <rect x={0} y={h + streetH} width={w} height={streetH} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={1} />
          <line x1={w + 8} y1={h + streetH} x2={w + 8} y2={h + streetH * 2} stroke="#64748b" strokeWidth={0.8} />
          <text x={w + 14} y={h + streetH + streetH / 2} textAnchor="start" dominantBaseline="middle" className="fill-slate-600 text-[14px] font-medium">12.5 م</text>
          <text x={w / 2} y={h + streetH + streetH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-base">شارع الجار 12.5 م</text>

          <line x1={w} y1={0} x2={w} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text
            x={w + 14}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-700 text-base font-bold"
            transform={`rotate(90, ${w + 14}, ${h / 2})`}
          >
            52.5 م — شرق (طريق الجبيل)
          </text>

          <line x1={0} y1={0} x2={0} y2={h} stroke="#64748b" strokeWidth={1} strokeDasharray="4" />
          <text
            x={-14}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600 text-base"
            transform={`rotate(-90, -14, ${h / 2})`}
          >
            المنطقة ب (إيواء)
          </text>

          {/* ساحة الحراج — تدفق شمال→جنوب، منصة عند الجنوب، صفوف عرضية */}
          {(() => {
            const auctionX0 = roadCenterX + gw / 2 + 5;
            const auctionY0 = gw + 8;
            const auctionW = w - auctionX0 - 8;
            const auctionH = h - auctionY0 - gw - 8;
            const spotW = 5 * scale;
            const spotH = 2.5 * scale;
            const aisleW = 4 * scale;
            const platformW = 14 * scale;
            const platformH = 10 * scale;
            // منطقة تجميع للمخرج — شريط جنوبي كامل، والمنصة في المنتصف (فجوة أوسع بين الصفوف والمنصة)
            const collectZoneY = auctionY0 + auctionH - platformH - 28;
            const collectZoneX = auctionX0;
            const collectZoneW = auctionW;
            const collectZoneH = platformH;
            const platformX = auctionX0 + (auctionW - platformW) / 2;
            const platformY = collectZoneY;
            const rows = 5;
            const cols = 14;
            const rowStep = (spotH + aisleW);
            return (
              <g>
                {/* خلفية ساحة الحراج */}
                <rect x={auctionX0} y={auctionY0} width={auctionW} height={auctionH} fill="#eef2ff" fillOpacity={0.6} stroke="#6366f1" strokeWidth={1} strokeDasharray="4 2" />
                {/* صفوف عرض السيارات — فوق المنصة، تدفق من الشمال إلى الجنوب */}
                {Array.from({ length: rows }).map((_, rowIndex) => {
                  const rowY = auctionY0 + 12 + rowIndex * rowStep;
                  if (rowY + spotH > platformY - 20) return null;
                  return (
                    <g key={rowIndex}>
                      {/* ممر بين الصفوف — للتنقل جنوباً */}
                      {rowIndex > 0 && (
                        <rect x={auctionX0} y={rowY - aisleW} width={auctionW} height={aisleW} fill="#e0e7ff" fillOpacity={0.4} stroke="none" />
                      )}
                      {Array.from({ length: cols }).map((_, colIndex) => {
                        const spotX = auctionX0 + 8 + colIndex * (spotW + 3);
                        if (spotX + spotW > auctionX0 + auctionW) return null;
                        return (
                          <rect
                            key={colIndex}
                            x={spotX}
                            y={rowY}
                            width={spotW}
                            height={spotH}
                            fill="#c7d2fe"
                            fillOpacity={0.7}
                            stroke="#818cf8"
                            strokeWidth={0.8}
                            rx={2}
                          />
                        );
                      })}
                    </g>
                  );
                })}
                {/* منطقة تجميع — يسار المنصة: غير مباعة (أصحابها غائبون)، يمين المنصة: مُباعة للمخرج */}
                <rect x={collectZoneX} y={collectZoneY} width={collectZoneW} height={collectZoneH} fill="#f8fafc" fillOpacity={0.5} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" rx={4} />
                {/* يسار المنصة — غير مباعة، أصحابها غائبون */}
                <rect x={collectZoneX} y={platformY} width={platformX - collectZoneX - 4} height={platformH} fill="#fef3c7" fillOpacity={0.7} stroke="#f59e0b" strokeWidth={1} rx={3} />
                <text x={collectZoneX + (platformX - collectZoneX - 4) / 2} y={platformY + platformH / 2 - 14} textAnchor="middle" dominantBaseline="middle" className="fill-amber-900 text-[14px] font-bold">تجميع يسار المنصة</text>
                <text x={collectZoneX + (platformX - collectZoneX - 4) / 2} y={platformY + platformH / 2 + 14} textAnchor="middle" dominantBaseline="middle" className="fill-amber-700 text-[12px]">لم تُبع — أصحابها غائبون</text>
                {/* منصة المزاد — في الوسط */}
                <rect x={platformX} y={platformY} width={platformW} height={platformH} fill="#4f46e5" fillOpacity={0.9} stroke="#3730a3" strokeWidth={2} rx={4} />
                <text x={platformX + platformW / 2} y={platformY + platformH / 2 - 10} textAnchor="middle" dominantBaseline="middle" className="fill-white text-sm font-bold">منصة المزاد</text>
                <text x={platformX + platformW / 2} y={platformY + platformH / 2 + 12} textAnchor="middle" dominantBaseline="middle" className="fill-indigo-200 text-[13px]">شاشات + منادي</text>
                {/* يمين المنصة — مُباعة للمخرج */}
                <rect x={platformX + platformW + 4} y={platformY} width={collectZoneX + collectZoneW - (platformX + platformW) - 4} height={platformH} fill="#dcfce7" fillOpacity={0.7} stroke="#22c55e" strokeWidth={1} rx={3} />
                <text x={platformX + platformW + 4 + (collectZoneX + collectZoneW - platformX - platformW - 8) / 2} y={platformY + platformH / 2 - 14} textAnchor="middle" dominantBaseline="middle" className="fill-green-900 text-[14px] font-bold">تجميع يمين المنصة</text>
                <text x={platformX + platformW + 4 + (collectZoneX + collectZoneW - platformX - platformW - 8) / 2} y={platformY + platformH / 2 + 14} textAnchor="middle" dominantBaseline="middle" className="fill-green-700 text-[12px]">مُباعة — تنتظر الخروج</text>
                {/* سهم التدفق شمال → جنوب */}
                <path
                  d={`M ${auctionX0 + auctionW / 2} ${auctionY0 + 8} L ${auctionX0 + auctionW / 2} ${platformY - 12}`}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  markerEnd="url(#arrow-entry)"
                  opacity={0.9}
                />
                <text x={auctionX0 + auctionW / 2 + 25} y={(auctionY0 + platformY) / 2} textAnchor="start" dominantBaseline="middle" className="fill-green-700 text-[12px] font-semibold">تدفق شمال→جنوب</text>
                {/* ٣ توزيع: من الطريق إلى صفوف الشمال */}
                <path
                  d={`M ${roadCenterX + gw / 2 + 2} ${gw + 50} L ${auctionX0 + 30} ${auctionY0 + 25}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  markerEnd="url(#arrow-entry)"
                  opacity={0.9}
                />
                <circle cx={auctionX0 + 35} cy={auctionY0 + 30} r={8} fill="#10b981" stroke="#047857" strokeWidth={1.5} />
                <text x={auctionX0 + 35} y={auctionY0 + 30} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[12px] font-bold">3</text>
                <text x={roadCenterX + gw + 30} y={(gw + 50 + auctionY0 + 25) / 2 - 18} textAnchor="start" className="fill-emerald-700 text-[13px] font-semibold">توزيع على الصفوف العرضية</text>
                {/* ٤+٥ منصة + تجميع — ٦ خروج */}
                <circle cx={platformX + platformW / 2} cy={platformY + platformH / 2} r={7} fill="#6366f1" stroke="#4338ca" strokeWidth={1} />
                <text x={platformX + platformW / 2} y={platformY + platformH / 2} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[12px] font-bold">4</text>
                {/* مسار الخروج — مخرج ١ يبدأ من الطرف السفلي لتجميع يسار المنصة */}
                <path
                  d={`M ${collectZoneX + (platformX - collectZoneX - 4) / 2} ${platformY + platformH + 4} L ${roadCenterX + gw / 2 - 5} ${h - gateDepth - 30} L ${stripW + gw / 2} ${h - gateDepth - 15}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  markerEnd="url(#arrow-exit)"
                  opacity={0.9}
                />
                <path
                  d={`M ${auctionX0 + auctionW - 35} ${platformY + platformH / 2} L ${w - gw / 2 - 25} ${h - gateDepth - 15}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  markerEnd="url(#arrow-exit)"
                  opacity={0.8}
                />
                <circle cx={stripW + gw / 2} cy={h - gateDepth - 15} r={8} fill="#f59e0b" stroke="#b45309" strokeWidth={1.5} />
                <text x={stripW + gw / 2} y={h - gateDepth - 15} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[12px] font-bold">6</text>
                <text x={stripW + gw / 2} y={h - gateDepth - 28} textAnchor="middle" className="fill-amber-800 text-[12px]">مخرج ١</text>
                <text x={w - gw / 2 - 25} y={h - gateDepth - 28} textAnchor="middle" className="fill-amber-800 text-[12px]">مخرج ٢</text>
                {/* تسمية — بين صفوف السيارات والمنصة */}
                <text x={auctionX0 + auctionW / 2} y={platformY - 10} textAnchor="middle" className="fill-slate-600 text-[14px] font-semibold">صفوف عرضية (~150 سيارة) | تدفق شمال→جنوب | ساحة ≈4,100 م²</text>
                <text x={roadCenterX - 25} y={h / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-[13px] font-medium" transform={`rotate(-90, ${roadCenterX - 25}, ${h / 2})`}>طريق داخلي 7م</text>
              </g>
            );
          })()}

          {/* مقياس الرسم — على يمين المخطط */}
          <g>
            <line x1={w + 12} y1={h - 25} x2={w + 12 + 20 * scale} y2={h - 25} stroke="#334155" strokeWidth={2} />
            <line x1={w + 12} y1={h - 29} x2={w + 12} y2={h - 21} stroke="#334155" strokeWidth={1} />
            <line x1={w + 12 + 20 * scale} y1={h - 29} x2={w + 12 + 20 * scale} y2={h - 21} stroke="#334155" strokeWidth={1} />
            <text x={w + 12 + 10 * scale} y={h - 8} textAnchor="middle" className="fill-slate-600 text-[13px] font-semibold">مقياس 20 م</text>
          </g>

          {/* مخطط تدفق حركة السيارات — شمال→جنوب */}
          <rect x={15} y={h + streetH * 2 - 2} width={w - 30} height={58} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1} rx={4} />
          <text x={w / 2} y={h + streetH * 2 + 8} textAnchor="middle" className="fill-slate-700 text-[14px] font-bold">تدفق حركة السيارات: شمال → جنوب</text>
          <text x={w / 2} y={h + streetH * 2 + 26} textAnchor="middle" className="fill-slate-600 text-[13px]">
            مدخل ١ ← طريق ٢ ← توزيع ٣ ← منصة ٤ ← يمين: مبيعة، يسار: غير مبيعة ← مخرج ١ أو ٢ ← شارعنا
          </text>
          <text x={w / 2} y={h + streetH * 2 + 46} textAnchor="middle" className="fill-amber-700 text-[12px]">بعد نجاح عملية بيع المزاد تتحرك السيارة من ساحة المزاد إلى أماكن أخرى</text>
        </g>
      </svg>
    </div>
  );
}
