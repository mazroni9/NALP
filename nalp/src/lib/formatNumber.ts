/**
 * formatNumber.ts — Re-export من numberFormatter (المصدر المركزي)
 * يحافظ على توافق imports الحالية
 */
export { formatNumber, formatSAR, parseNumber } from "./numberFormatter";
export type { FormatOptions } from "./numberFormatter";
