# تدقيق مصدر الحقيقة المالية — NALP

**التاريخ:** 2026-03  
**الغرض:** توحيد الحقيقة المالية داخل المشروع؛ تحديد كل ملف يعرض أو يحسب أرقاماً استثمارية، وكون الرقم hardcoded أم محسوباً، ومدى تطابقه مع المصدر المركزي، ثم قائمة التعارضات وإجراءات التوحيد.

---

## 1. المصدر المركزي الوحيد (بعد التوحيد)

| المورد | الملف | الاستخدام |
|--------|-------|-----------|
| **ثوابت الاستثمار والافتراضات** | `nalp/src/lib/financialCanon.ts` | CAP_RATE، REQUIRED_CAPITAL، LAND، ZONE_*_RAW، ZONE_OPERATIONAL، WATERFALL_*، PARTNERSHIP_YEARS — لا تُعرض في الواجهة كـ totals وإنما كمدخلات للمحرك. |
| **محرك الإسقاط** | `nalp/src/lib/calculators/returnsEngine.ts` | buildProjection(zoneId, investmentAmount, years) — يُستخدم فقط عبر projectTotalsEngine أو صفحات المستثمر. |
| **محرك الإجماليات** | `nalp/src/lib/calculators/projectTotalsEngine.ts` | computeProjectTotalsFromEngine({ years: 8 }) — **المصدر الوحيد** لـ: total owner income، average annual income، exit valuation، cap rate، zone totals (perZone). |

**قاعدة:** أي صفحة أو مكوّن يعرض total owner income، average annual income، exit valuation، partnership years، cap rate، أو zone totals (دخل ملاك 8 سنوات لكل منطقة) **يجب** أن يقرأها من `computeProjectTotalsFromEngine` فقط. لا أرقام استثمارية hardcoded في الواجهات.

---

## 2. جدول الملفات المالية المهمة

| الملف | الأرقام المعروضة/المحسوبة | hardcoded أم محسوب | متطابق مع المصدر المركزي؟ |
|-------|----------------------------|---------------------|----------------------------|
| **financialCanon.ts** | CAP_RATE، REQUIRED_CAPITAL، ZONE_*_RAW (ownerIncome8Years، revenue8Years، …)، PROJECT_TOTALS | ثوابت (مدخلات للمحرك)؛ PROJECT_TOTALS محسوب من RAW | PROJECT_TOTALS لا يُفترض أن يُستخدم في UI — تعارض محتمل إذا استُخدم. |
| **projectTotalsEngine.ts** | ownerTotalIncome8Years، avgAnnualIncome، valuationAtExit، capRate، partnershipYears، perZone | **محسوب** من buildProjection | هذا هو المصدر المركزي. |
| **projectData.ts** | Re-export لـ LAND، ZONE_A/B/C/D، PROJECT_TOTALS | يعيد تصدير Canon فقط | لا يعرض أرقاماً؛ قد يورّط مكونات تستخدم ZONE_*.ownerIncome8Years. |
| **SnapshotCards.tsx** | ownerTotalIncome8Years، avgAnnualIncome، valuationAtExit، zonesCount | محسوب من computeProjectTotalsFromEngine | ✅ نعم. |
| **ValuationSimulator.tsx** | capRate، valuationAtExit، avgAnnualIncome | من computeProjectTotalsFromEngine | ✅ نعم. |
| **portal/dashboard/page.tsx** | ownerTotalIncome8Years، avgAnnualIncome، valuationAtExit، REQUIRED_CAPITAL | Totals من المحرك؛ REQUIRED_CAPITAL من Canon | ✅ نعم. |
| **portal/board/page.tsx** | totals.avgAnnualIncome، netDistributableAnnual (من timeline)، BOARD_STRUCTURE (totalAdminCost، maxAdminBudget) | الدخل من المحرك؛ مصاريف المجلس من boardData | ✅ دخل الملاك من المحرك. مصاريف المجلس ثابتة سياسة. |
| **portal/investors/page.tsx** | buildProjection، REQUIRED_CAPITAL | من Canon + returnsEngine | ✅ نعم. |
| **portal/scenarios/page.tsx** | capRate من المحرك؛ ZONE_* للسيناريوهات (occupancy، roomPrice، …) | capRate من المحرك؛ معاملات من Canon | ✅ نعم. |
| **InvestorViewBlock.tsx** | REQUIRED_CAPITAL، buildProjection | من Canon + returnsEngine | ✅ نعم. |
| **FinancialsZoneCards.tsx** | getCompanyAnnual، ZONE_OPERATIONAL، REQUIRED_CAPITAL | من Canon + returnsEngine | ✅ نعم (لا يعرض owner total 8y). |
| **ZoneCards.tsx** | ZONE_A/B/C/D: name، revenue8Years، opexPercent، **ownerIncome8Years**، annualRevenue، … | **ownerIncome8Years من Canon (RAW) — ثابت** | ❌ **تعارض:** دخل الملاك 8 سنوات من RAW وليس من المحرك. |
| **partnersData.ts** | COMPANY.totalIncome8Years، avgAnnualIncome، valuationAtExit، capRate من _engineTotals؛ LAND_VALUATION (grossValue، netValueToOwners) ثابت | COMPANY من المحرك؛ LAND_VALUATION hardcoded | ✅ COMPANY من المحرك. LAND_VALUATION عقاري منفصل — يُسجّل في الافتراضات. |
| **boardData.ts** | BOARD_STRUCTURE.annualIncome = 6_750_303، maxAdminBudget، totalAdminCost؛ foundingDebts.totalDebt | **ثابت** | ⚠️ annualIncome لا يُعرض في لوحة المجلس (تُعرض totals.avgAnnualIncome). القيمة 6_750_303 legacy — يُسجّل في التقرير. |
| **distributionTimeline.ts** | getProjectOwnerIncomeByYear؛ foundingDebts من boardData | دخل من المحرك؛ ديون/مجلس من boardData | ✅ دخل من المحرك. |

---

## 3. قائمة التعارضات السابقة

| # | الوصف | الملف المعني | الإجراء |
|---|--------|--------------|---------|
| 1 | عرض "دخل ملاك الأرض (8 سنوات)" لكل منطقة من ZONE_*_RAW (ثابت) بدلاً من المحرك | ZoneCards.tsx | جعل ZoneCards يقرأ ownerIncome8Years من computeProjectTotalsFromEngine().perZone فقط. |
| 2 | PROJECT_TOTALS يعيد إنتاج إجماليات من RAW وليست من المحرك | financialCanon.ts، projectData.ts | عدم استخدام PROJECT_TOTALS في أي واجهة؛ الإبقاء عليه كـ legacy مع توثيق. |
| 3 | BOARD_STRUCTURE.annualIncome = 6_750_303 ثابت | boardData.ts | عدم استخدامه للعرض؛ لوحة المجلس تعرض بالفعل totals.avgAnnualIncome. توثيق أن annualIncome في boardData legacy. |
| 4 | partnershipYears = 10 مكرر في projectTotalsEngine | projectTotalsEngine.ts | استيراد PARTNERSHIP_YEARS من financialCanon واستخدامه في المحرك. |

---

## 4. ما تم توحيده (بعد التنفيذ)

- **ZoneCards.tsx:** دخل ملاك الأرض 8 سنوات لكل منطقة يُقرأ فقط من `computeProjectTotalsFromEngine({ years: 8 }).perZone[zoneId].ownerIncome8Years`. باقي الحقول (الاسم، إيراد 8 سنوات، إيراد سنوي، OPEX، المخاطر) من projectData/financialCanon كمدخلات وصفية — لا أرقام استثمارية hardcoded للـ totals.
- **partnershipYears:** إضافة ثابت `PARTNERSHIP_YEARS = 10` في `financialCanon.ts`؛ استخدامه في `PROJECT_TOTALS.partnershipYears` وفي `projectTotalsEngine` بدل القيمة الثابتة 10 — مصدر واحد للقيمة.
- **boardData.ts:** توثيق أن `BOARD_STRUCTURE.annualIncome` legacy؛ لوحة المجلس تعرض بالفعل `totals.avgAnnualIncome` من المحرك — لم يُستخدم annualIncome الثابت في الواجهة.
- **جميع الصفحات:** تعرض نفس الـ totals ونفس سنوات الشراكة ونفس مدخلات التقييم (cap rate من المحرك) عند استخدام نفس الخيارات (years: 8، mode: operationalBaseline).
- **التقرير:** هذا الملف يعكس التعارضات السابقة وإجراءات التوحيد أعلاه.

---

## 5. أرقام لا تُعتبر "استثمارية totals" — مسموح أن تبقى في Canon أو ملفات منفصلة

- **REQUIRED_CAPITAL:** ثوابت إدارية — تبقى في financialCanon ويقرأها المحرك والواجهات من هناك.
- **مصاريف المجلس والديون التأسيسية:** boardData — سياسة تشغيلية؛ لا تُستمد من المحرك.
- **LAND_VALUATION (عقاري):** سعر المتر، grossValue، netValueToOwners — تُسجّل في سجل الافتراضات لاحقاً ولا تُخلط مع دخل التشغيل من المحرك.

---

## 6. المرحلة الثانية — سجل الافتراضات والسيناريوهات

- **سجل الافتراضات المركزي:** `nalp/src/lib/finance/assumptions.ts` — يجمع كل الفرضيات (project، zone A/B/C/D) مع key، value، unit، description، confidenceLevel، sourceType. ثوابت المشروع (CAP_RATE، PARTNERSHIP_YEARS، REQUIRED_CAPITAL) في financialCanon تُستمد من `getDefaultAssumptionsBundle()`.
- **التوثيق:** `docs/investment-assumptions-register.md` — يشرح جميع الفرضيات بلغة واضحة ومهنية.
- **المحرك مربوط بالافتراضات:** `computeProjectTotalsFromEngine` يقبل اختيارياً `assumptions: AssumptionsBundle`؛ عند تمريره تُستخدم فرضيات الحزمة بدل القيم المبعثرة.
- **السيناريوهات (downside / base / upside):** طبقة إدخال واحدة — `getScenarioAssumptions(scenarioId)` و`computeProjectMetrics(scenarioId, years)`؛ محرك مشترك واحد دون نسخ.
- **اختبارات مالية:** `nalp/src/lib/finance/financial.test.ts` — تتحقق من: مجموع المناطق = الإجمالي، الدخل السنوي = الإجمالي/السنوات، اتساق التقييم، عدم ظهور مخرجات سالبة غير مسموحة، ترتيب السيناريوهات منطقي.
