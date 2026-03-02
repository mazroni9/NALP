# تقرير: موقع محرك الأرباح داخل المشروع

**التاريخ:** 2026-03  
**الغرض:** تحديد مكان محرك المال (Financial Engine) داخل الريبو تمهيدًا لمراجعة تدقيقية.

---

## الإجابة المختصرة

**محرك الأرباح موجود في: B) موزع بين عدة ملفات**

وليس في (A) ملف واحد، وليس (C) داخل React components.

---

## التفصيل

### 1. الملفات الأساسية لمحرك المال

| الملف | المسار | الوظيفة |
|-------|--------|---------|
| **financialCanon.ts** | `nalp/src/lib/financialCanon.ts` | المصدر الوحيد للحقيقة المالية: الثوابت، البيانات الخام، ZONE_OPERATIONAL، REQUIRED_CAPITAL، PROJECT_TOTALS، نسب Zone-D |
| **returnsEngine.ts** | `nalp/src/lib/calculators/returnsEngine.ts` | `buildProjection`, `getCompanyAnnual`, `getInvestorAnnual` — حسابات العوائد والتوقعات |
| **ledgerEngine.ts** | `nalp/src/lib/calculators/ledgerEngine.ts` | `computeZoneALedgerSummary`, `parseLedgerFromRaw` — دفتر التشغيل والـ break-even شهرياً |

### 2. هل الحسابات داخل React؟

**لا.** الحسابات المالية تُنفَّذ داخل دوال خالصة (pure functions) في `lib/`:

- `investors/page.tsx` → يستدعي `buildProjection()` و `computeZoneALedgerSummary()` من `lib`
- `InvestorViewBlock.tsx` → يستدعي `buildProjection()` من `lib`
- `FinancialsZoneCards.tsx` → يستدعي `getCompanyAnnual()` من `lib`

لا يوجد منطق حسابي داخل مكوّنات React؛ المكوّنات تقوم بالـ call فقط.

### 3. الملفات المساعدة (غير حسابات)

| الملف | الدور |
|-------|-------|
| `projectData.ts` | Re-export من `financialCanon` للتوافق مع imports قديمة |
| `formatNumber.ts` / `numberFormatter.ts` | تنسيق عرض الأرقام فقط — ليس حساباً |
| `financialData.ts` | بيانات قديمة (بملايين) — لا يُستورد في المحرك الرئيسي، يبدو legacy |

### 4. نقاط المراجعة (حسب كلامك)

| الموضوع | الموقع المتوقع |
|---------|----------------|
| Assumptions داخل الحساب | `financialCanon.ts` + `returnsEngine.ts` |
| ترتيب الخصومات | `returnsEngine.ts` (Zone A loop) + `ledgerEngine.ts` |
| تداخل break-even logic | `returnsEngine.ts` (Zone A, D) + `ledgerEngine.ts` |
| ازدواجية OPEX cap | Zone A: `ZONE_A_YEARLY_MODEL.opexCapPercent` + `ledgerEngine` OPEX_CAP |
| investor split calculation | `returnsEngine.ts` (fundingRatio, investorShare) + `ledgerEngine.ts` (investorShareOfOperator) |

### 5. هيكل التبعيات

```
financialCanon.ts  ← مصدر الثوابت والبيانات
       ↑
       ├── returnsEngine.ts   (buildProjection, getCompanyAnnual, getInvestorAnnual)
       └── ledgerEngine.ts   (computeZoneALedgerSummary)
```

### 6. توصية: نسخة تدقيق (Audit Snapshot)

للمراجعة المستقلة، أنشئ مجلد `/audit/financial-audit-2026-03` وضع فيه:

- `financialCanon.ts`
- `returnsEngine.ts`
- `ledgerEngine.ts`
- `numberFormatter.ts` (إن احتجت تنسيق الأرقام في أمثلة المخرجات)
- مثال JSON للمدخلات (مثلاً LedgerState)
- مثال JSON للمخرجات (ProjectionRow[], LedgerSummary)

بدون باقي المشروع — يعزل محرك المال عن الضوضاء.

---

## الخلاصة

- **الموقع:** محرك الأرباح موزع على ثلاثة ملفات رئيسية في `lib/`.
- **الأسلوب:** Pure functions و deterministic — الحسابات لا تُجرى أثناء render.
- **المرحلة التالية:** تجميد نسخة تدقيق في `/audit/financial-audit-2026-03` والمراجعة على المحرك فقط.
