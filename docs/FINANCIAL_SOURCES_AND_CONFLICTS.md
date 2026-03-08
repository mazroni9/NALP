# تقرير مصادر الأرقام المالية والتعارضات — NALP

**التاريخ:** 2026-03  
**الغرض:** تحديد مصدر الحقيقة الحالي لكل رقم مالي، ورصد التعارضات تمهيداً لتوحيد المصدر ومنع الأرقام الثابتة في الواجهات.

---

## 1. مصدر الحقيقة المُفترض (الحالي)

| المصدر | الملف | الوصف |
|--------|-------|--------|
| **Canon (ثوابت)** | `nalp/src/lib/financialCanon.ts` | CAP_RATE، LAND، ZONE_*_RAW، ZONE_OPERATIONAL، REQUIRED_CAPITAL، WATERFALL_*، PROJECT_TOTALS (legacy) |
| **محرك العوائد** | `nalp/src/lib/calculators/returnsEngine.ts` | buildProjection() — إسقاط سنوي لكل منطقة (A: zone A waterfall؛ B/C/D: 3-layer waterfall) |
| **محرك الإجماليات** | `nalp/src/lib/calculators/projectTotalsEngine.ts` | computeProjectTotalsFromEngine() — إجمالي دخل الملاك 8 سنوات، متوسط سنوي، التقييم عند الخروج |
| **Re-export** | `nalp/src/lib/projectData.ts` | يعيد تصدير LAND، ZONE_A/B/C/D، PROJECT_TOTALS من financialCanon فقط (لا يحسب من المحرك) |

**السياسة المُعلنة:** الواجهة يجب أن تعتمد على المحرك (projectTotalsEngine + returnsEngine) وليس على PROJECT_TOTALS أو ZONE_*_RAW.ownerIncome8Years الثابت.

---

## 2. خرائط الاستخدام (من يقرأ من أين)

| المكوّن | ما يقرأه | مصدر الحقيقة الفعلي |
|---------|----------|----------------------|
| SnapshotCards | computeProjectTotalsFromEngine() | ✅ محرك |
| ValuationSimulator | computeProjectTotalsFromEngine() | ✅ محرك |
| Dashboard (portal) | computeProjectTotalsFromEngine() | ✅ محرك |
| ZoneCards | ZONE_A/B/C/D من projectData | ⚠️ financialCanon (RAW) — **دخل الملاك 8 سنوات من أرقام ثابتة** |
| Scenarios page | ZONE_* من projectData + capRate من المحرك | ⚠️ مختلط |
| InvestorViewBlock | REQUIRED_CAPITAL، buildProjection() | ✅ canon + محرك |
| Investors page | buildProjection()، REQUIRED_CAPITAL | ✅ canon + محرك |
| Partners (COMPANY) | _engineTotals من projectTotalsEngine | ✅ محرك |
| Board page | totals من المحرك + BOARD_STRUCTURE (ثابت) | ⚠️ annualIncome في boardData ثابت 6_750_303 |
| distributionTimeline | getProjectOwnerIncomeByYear()، foundingDebts | ✅ محرك + boardData (ديون/مجلس ثابتة) |
| AssumptionsPanel | نصوص ثابتة من financialCanon | ✅ canon |

---

## 3. تعارضات مؤكدة

| الرقم | مصدر 1 | مصدر 2 | ملاحظة |
|-------|--------|--------|--------|
| **إجمالي دخل الملاك 8 سنوات** | PROJECT_TOTALS.ownerTotalIncome8Years = sum(ZONE_*_RAW.ownerIncome8Years) | computeProjectTotalsFromEngine().ownerTotalIncome8Years | المحرك يستخدم منطق waterfall وzone A ديناميكي؛ RAW أرقام brochure ثابتة. المجموعان قد يختلفان. |
| **متوسط الدخل السنوي** | PROJECT_TOTALS.avgAnnualIncome | totals.avgAnnualIncome من المحرك | نفس التعارض أعلاه. |
| **التقييم عند الخروج** | PROJECT_TOTALS.valuationAtExit | totals.valuationAtExit من المحرك | مشتق من متوسط الدخل ÷ CAP_RATE. |
| **دخل الملاك لكل منطقة (8 سنوات)** | ZONE_A/B/C/D.ownerIncome8Years (ثابت في ZoneCards) | totals.perZone[].ownerIncome8Years من المحرك | ZoneCards يعرض RAW؛ Snapshot يعرض محرك — **تعارض واضح في الواجهة**. |
| **دخل سنوي للشركاء/المجلس** | boardData.BOARD_STRUCTURE.annualIncome = 6_750_303 | _engineTotals.avgAnnualIncome (partnersData/COMPANY) | boardData ثابت؛ الشركاء يأخذون من المحرك. لو تغيّر المحرك يبقى المجلس يعرض 6_750_303 ما لم يُربط بالمحرك. |
| **ديون تأسيسية / مصاريف مجلس** | boardData: totalDebt 4_600_000، totalAdminCost 522_000 | مستخدمة في distributionTimeline وبدون مصدر بديل | قيم ثابتة مقبولة كـ policy constants لكن يجب أن تكون في سجل افتراضات مركزي. |

---

## 4. أرقام ثابتة (Hardcoded) يجب توحيدها أو تسجيلها

| الموقع | القيمة | الوصف |
|--------|--------|--------|
| financialCanon.ts | ZONE_*_RAW.ownerIncome8Years، revenue8Years، إلخ | بيانات brochure — يُفترض أن تُستبدل تدريجياً بمخرجات المحرك أو تُعلّم كـ legacy |
| financialCanon.ts | REQUIRED_CAPITAL[A/B/C/D] | ثوابت إدارية — تبقى في Canon أو تنتقل إلى assumptions register |
| boardData.ts | annualIncome 6_750_303، maxAdminBudget 675_030، totalAdminCost 522_000 | يجب استمداد annualIncome من المحرك؛ الباقي policy |
| boardData.ts | foundingDebts.totalDebt 4_600_000 | سياسة — تُدرج في assumptions register |
| partnersData.ts | LAND_VALUATION.grossValue 19_012_500، netValueToOwners 18_632_250 | عقاري — يُفضّل نقله إلى مصدر مركزي أو assumptions register |
| zoneCAreas.ts | أبعاد منطقة ج (أرقام ثابتة) | تصميم — يمكن تسجيلها كافتراضات تقنية |

---

## 5. التوصيات للمرحلة التالية (Phase 2)

1. **منع عرض RAW في الواجهة لدخل الملاك:** جعل ZoneCards (أو أي بطاقات تعرض "دخل ملاك الأرض 8 سنوات") يأخذ القيم من `computeProjectTotalsFromEngine().perZone` بدلاً من ZONE_A/B/C/D.ownerIncome8Years.
2. **ربط لوحة المجلس:** جعل BOARD_STRUCTURE.annualIncome (أو عرض "إجمالي الدخل السنوي") يُستمد من المحرك عند العرض، مع الإبقاء على مصاريف المجلس والديون كثوابت سياسة في ملف واحد.
3. **إبقاء PROJECT_TOTALS للتوافق الداخلي فقط:** عدم استخدامه في أي UI؛ الإبقاء عليه كـ legacy وربما إضافة تحذير في الكود.
4. **سجل الافتراضات (Phase 3):** إنشاء assumptions register مركزي يتضمن كل ثابت (القيمة، الوحدة، الوصف، مستوى الثقة، نوع المصدر) بحيث لا يبقى أي رقم "مجهول المصدر".

---

## 6. التحقق القابل للقياس (للمرحلة 4)

- **مجموع المناطق:** مجموع perZone[].ownerIncome8Years من المحرك = ownerTotalIncome8Years من نفس المحرك.
- **متوسط الدخل السنوي:** ownerTotalIncome8Years / 8 = avgAnnualIncome (بالتقريب).
- **التقييم:** avgAnnualIncome / CAP_RATE = valuationAtExit (بالتقريب).
- **اتساق السيناريوهات:** عند تغيير معاملات السيناريو (مثلاً occupancy أو room price)، التغيير في الإجماليات يكون متسقاً مع معادلة المحرك.

هذا التقرير يُحدّث عند تنفيذ Phase 2 و 3.
