/**
 * يولد zone-c-report.html من نفس بيانات منطقة ج
 * يشغّل تلقائياً مع البناء أو يدوياً: npm run generate:zone-c-report
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { computeZoneCAreas } from "../src/lib/zoneCAreas";
import { ZONE_CONFIGS } from "../src/lib/nalpLandSketch";
import { ROOMS_PER_BUILDING } from "../src/lib/roomLayout";

const zone = ZONE_CONFIGS.find((z) => z.id === "c")!;
const zoneCAreas = computeZoneCAreas();
const totalRooms = ROOMS_PER_BUILDING["7m"].total + 5 * ROOMS_PER_BUILDING["14m"].total;

const buildingsCost = zoneCAreas.buildingsTotalM2 * 1000;
const infraCost = (zoneCAreas.parkingsTotalM2 + zoneCAreas.roadM2) * 200;
const totalCost = buildingsCost + infraCost;

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المنطقة ج — ${zone.title}</title>
  <style>
    @page { size: A4; margin: 2cm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      font-size: 14pt;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 { font-size: 1.75rem; color: #1e293b; margin-bottom: 0.5rem; }
    h2 { font-size: 1.25rem; color: #334155; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    p { margin: 0.5rem 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-size: 0.95rem;
    }
    th, td {
      border: 1px solid #94a3b8;
      padding: 0.5rem 0.75rem;
      text-align: right;
    }
    th { background: #f1f5f9; font-weight: 600; }
    .summary-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
    }
    .summary-box p { margin: 0.4rem 0; display: flex; justify-content: space-between; gap: 1rem; }
    .summary-box .total { border-top: 1px solid #cbd5e1; padding-top: 0.75rem; margin-top: 0.5rem; font-weight: 700; }
    ul { margin: 0.5rem 0; padding-right: 1.5rem; }
    li { margin: 0.25rem 0; }
    .meta { font-size: 0.85rem; color: #64748b; margin-top: 2rem; }
    @media print {
      body { padding: 0; }
      hr { page-break-after: avoid; }
      h2 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
      .summary-box { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

<h1>المنطقة ج: ${zone.title}</h1>
<p><strong>الوصف المختصر:</strong> ${zone.shortDesc}</p>

<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;">

<h2>١. اسكتش الأبعاد والحدود</h2>
<p>
  ٦ مباني و٥ مواقف (٢٥م بينها)، مبنى شرقي ٧×٧م ومباني وسطية ١٤×١٤م. المتبقي (٦ م طولي) مواقف بين مبنى ٦ ومنطقة الإيواء. المساحة المتبقية من عمق ٥٢.٥م بعد استخدام ٤٨.٥م للمباني = ٤م تُخصَّص كطريق يربط ساحات المواقف من خلف المباني مع بعضها. تُخصَّص الغرف السفلية من مبنى ٦ مكاتب لقسم الإيواء وخدمات مثل ميني سوبرماركت ومقهى صغير ومغسلة.
</p>

<h2>٢. الوصف</h2>
<p>
  ${zone.description}
</p>

<h2>٣. تخطيط الغرف لكل مبنى</h2>
<p>
  عمق ٧ م، عرض كل غرفة ٥ م، منطقة الدرج ٣.٥ م. العرض الكلي لا يتجاوز ٥٢.٥ م.
</p>
<div class="summary-box">
  <h4 style="margin-top: 0;">عدد الغرف لكل مبنى</h4>
  <ul>
    <li><strong>مبنى ١</strong> (٧م): ${ROOMS_PER_BUILDING["7m"].perFloor} غرفة/طابق — إجمالي ${ROOMS_PER_BUILDING["7m"].total} غرفة</li>
    <li><strong>مباني ٢–٦</strong> (١٤م): ${ROOMS_PER_BUILDING["14m"].perFloor} غرفة/طابق — إجمالي ${ROOMS_PER_BUILDING["14m"].total} غرفة لكل مبنى</li>
  </ul>
  <p><strong>المجموع: ${totalRooms} غرفة</strong></p>
</div>

<h2>٤. حساب المساحات</h2>
<p>تفصيل مساحات المباني والمواقف والطريق ٤م لاستخدامها في بطاقة تقدير التكاليف.</p>

<table>
  <thead>
    <tr>
      <th>المبنى</th>
      <th>العرض × العمق</th>
      <th>المساحة (م²)</th>
    </tr>
  </thead>
  <tbody>
${zoneCAreas.buildings
  .map(
    (b) =>
      `    <tr><td>مبنى ${b.id}</td><td>${b.widthM} × ${b.depthM} م</td><td>${b.areaM2.toLocaleString("ar-SA")}</td></tr>`
  )
  .join("\n")}
  </tbody>
</table>

<div class="summary-box">
  <p><span>مجموع المباني:</span> <span>${zoneCAreas.buildingsTotalM2.toLocaleString("ar-SA")} م²</span></p>
  <p><span>ساحات المواقف:</span> <span>${zoneCAreas.parkingsTotalM2.toLocaleString("ar-SA")} م²</span></p>
  <p><span>طريق ٤م (خلف المباني):</span> <span>${zoneCAreas.roadM2.toLocaleString("ar-SA")} م²</span></p>
  <p class="total"><span>إجمالي المنطقة ج:</span> <span>${zoneCAreas.zoneTotalM2.toLocaleString("ar-SA")} م²</span></p>
</div>

<h2>٥. تقدير التكاليف</h2>
<p>
  تكلفة المباني: ١٬٠٠٠ ريال/م². تسوية المواقف والشوارع والبنية التحتية (كهرباء، هاتف، مجاري، إلخ): ٢٠٠ ريال/م².
</p>
<div class="summary-box">
  <p><span>تكلفة المباني (${zoneCAreas.buildingsTotalM2.toLocaleString("ar-SA")} م² × ١٬٠٠٠ ر.س):</span> <span>${buildingsCost.toLocaleString("ar-SA")} ر.س</span></p>
  <p><span>المواقف + الطريق (${zoneCAreas.parkingsTotalM2.toLocaleString("ar-SA")} + ${zoneCAreas.roadM2.toLocaleString("ar-SA")} م² × ٢٠٠ ر.س):</span> <span>${infraCost.toLocaleString("ar-SA")} ر.س</span></p>
  <p class="total"><span>إجمالي التكلفة التقديرية:</span> <span>${totalCost.toLocaleString("ar-SA")} ر.س</span></p>
</div>

<h2>٦. المميزات الرئيسية</h2>
<ul>
  <li>مباني سكنية حديثة بطابقين (G+2)</li>
  <li>حوالي ${totalRooms} غرفة بنمط استوديو</li>
  <li>مبنى ٦ — الطابق الأرضي: مكاتب لقسم الإيواء، سوبرماركت صغير، مغسلة، وخدمات</li>
  <li>ساحات خضراء طولية وممرات مشاة</li>
</ul>

<h2>٧. جدوى المساحة لـ ${totalRooms} غرفة</h2>
<p>
  على الطول ٢٠٨ م: مبنى شرقي ٧م يطل شرقاً، مواقف ٢٥م، مباني وسطية ١٤م (ظهر لظهر — جزء يطل على المواقف وجزء على ساحة الإيواء)، وبين المبنى الشرقي وساحة الإيواء مواقف مهما كان حجمها.
</p>
<p>
  العمق الكلي ٥٢.٥ م يوفّر مجالاً للمباني (٧م أو ١٤م) ومساحات المواقف مع هامش للممرات. التصميم النهائي يعتمد على أبعاد وحدات C BOX الفعلية ومتطلبات البناء.
</p>

<p class="meta">— وثيقة المنطقة ج · NALP · محور الظهران–الجبيل</p>

</body>
</html>
`;

const outPath = join(__dirname, "..", "public", "zone-c-report.html");
writeFileSync(outPath, html, "utf-8");
console.log("✓ تم إنشاء zone-c-report.html بنجاح");
process.exit(0);
