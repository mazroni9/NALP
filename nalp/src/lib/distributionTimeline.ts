/**
 * توقيت توزيع الأرباح على ملاك الموقع (الشركاء):
 * أولوية: سداد الديون التأسيسية → مصاريف مجلس الإدارة → صافي موزَّع للشركاء.
 * مصدر الأرقام: دخل الملاك من المحرك (projectTotalsEngine).
 */

import { getProjectOwnerIncomeByYear } from "@/lib/calculators/projectTotalsEngine";
import { foundingDebts } from "@/lib/boardData";

const BOARD_COST_ANNUAL = 522_000; // من boardData.totalAdminCost

export interface DistributionYearRow {
  year: number;
  ownerIncomeFromEngine: number;
  debtPaid: number;
  debtRemainingAfter: number;
  boardPaid: number;
  distributableToPartners: number;
}

export interface DistributionTimelineResult {
  firstProfitYear: number; // أول سنة يتحقق فيها ربح موزَّع للشركاء (1-based)
  firstProfitAmount: number; // مبلغ أول توزيع (ريال)
  stabilizationYear: number; // السنة التي يستقر فيها التوزيع (بعد سداد الدين بالكامل)
  distributableByYear: number[];
  rows: DistributionYearRow[];
  totalDebt: number;
  boardCostAnnual: number;
}

/**
 * يحسب جدول التوزيع السنوي:
 * - أولاً: يُستخدم دخل الملاك بالكامل لسداد الديون التأسيسية حتى تنتهي (لا توزيعات ولا رواتب مجلس).
 * - بعد انتهاء الديون: يُخصم حد مصاريف المجلس السنوية، ثم يُوزَّع الباقي على الشركاء.
 */
export function computeDistributionTimeline(options?: {
  years?: number;
  totalDebt?: number;
  boardCostAnnual?: number;
}): DistributionTimelineResult {
  const years = options?.years ?? 8;
  const totalDebt = options?.totalDebt ?? foundingDebts.totalDebt;
  const boardCost = options?.boardCostAnnual ?? BOARD_COST_ANNUAL;

  const ownerIncomeByYear = getProjectOwnerIncomeByYear({ years });

  let debtRemaining = totalDebt;
  const distributableByYear: number[] = [];
  const rows: DistributionYearRow[] = [];
  let firstProfitYear = 0;
  let firstProfitAmount = 0;
  let stabilizationYear = 0;

  for (let y = 0; y < years; y++) {
    const year = y + 1;
    const income = ownerIncomeByYear[y] ?? 0;

    let debtPaid = 0;
    let boardPaid = 0;
    let distributable = 0;

    if (debtRemaining > 0) {
      // في مرحلة سداد الدين: يُوجَّه الدخل بالكامل للدين حتى ينتهي
      debtPaid = Math.min(income, debtRemaining);
      debtRemaining -= debtPaid;

      const remainingAfterDebt = income - debtPaid;
      if (debtRemaining <= 0 && remainingAfterDebt > 0) {
        // في سنة انتهاء الدين: ما يتبقّى بعد سداد الدين يُعامل كسنة عادية (رواتب مجلس ثم توزيع)
        boardPaid = Math.min(remainingAfterDebt, boardCost);
        distributable = Math.max(0, Math.round(remainingAfterDebt - boardPaid));
      }
    } else {
      // بعد سداد الدين بالكامل: دخل الملاك السنوي يُخصم منه مصاريف المجلس ثم يُوزَّع الباقي
      boardPaid = Math.min(income, boardCost);
      distributable = Math.max(0, Math.round(income - boardPaid));
    }

    distributableByYear.push(distributable);
    rows.push({
      year,
      ownerIncomeFromEngine: ownerIncomeByYear[y] ?? 0,
      debtPaid,
      debtRemainingAfter: debtRemaining,
      boardPaid,
      distributableToPartners: distributable,
    });

    if (firstProfitYear === 0 && distributable > 0) {
      firstProfitYear = year;
      firstProfitAmount = distributable;
    }
    if (stabilizationYear === 0 && debtRemaining <= 0) {
      stabilizationYear = year;
    }
  }
  if (stabilizationYear === 0) stabilizationYear = years + 1;

  return {
    firstProfitYear,
    firstProfitAmount,
    stabilizationYear,
    distributableByYear,
    rows,
    totalDebt,
    boardCostAnnual: boardCost,
  };
}
