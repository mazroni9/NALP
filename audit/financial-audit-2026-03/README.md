# Audit Snapshot: Financial Engine 2026-03

نسخة مجمّدة لمحرك الأرباح للمراجعة التدقيقية. يعزل المحرك عن باقي المشروع.

## الملفات

| الملف | الوصف |
|-------|-------|
| `financialCanon.ts` | المصدر الوحيد للحقيقة المالية — الثوابت، ZONE_RAW، ZONE_OPERATIONAL، REQUIRED_CAPITAL، PROJECT_TOTALS |
| `returnsEngine.ts` | `buildProjection`, `getCompanyAnnual` — حسابات العوائد والتوقعات |
| `ledgerEngine.ts` | `computeZoneALedgerSummary` — دفتر التشغيل شهرياً والـ break-even |
| `example-input-ledger.json` | مثال LedgerState للمدخلات |
| `example-output-projection.json` | مثال مخرجات buildProjection |
| `AUDIT-REPORT.md` | تقرير تحليلي مفصّل |

## تشغيل سريع (Node)

```bash
cd audit/financial-audit-2026-03
npx tsx -e "
const { buildProjection } = require('./returnsEngine.ts');
const r = buildProjection('A', 1500000, 10);
console.log(JSON.stringify({ breakEvenYear: r.breakEvenYear, year10: r.projections[9] }, null, 2));
"
```

أو استخدم الملفات يدوياً في مشروعك للمراجعة.

## نقاط المراجعة

- Assumptions (financialCanon)
- ترتيب الخصومات (returnsEngine Zone A loop)
- break-even logic (returnsEngine + ledgerEngine)
- OPEX cap (ZONE_A 25% vs ZONE_A_RAW 30%)
- investor split (0.5 * fundingRatio)
