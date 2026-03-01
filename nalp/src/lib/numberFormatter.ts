/**
 * numberFormatter.ts — تنسيق مركزي لجميع الأرقام المعروضة في الواجهة
 * فواصل آلاف + حد أقصى منزلتين عشريتين
 */

export interface FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatNumber(
  value: number | null | undefined,
  options?: FormatOptions
): string {
  const num = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(num);
}

export function formatSAR(
  value: number | null | undefined,
  options?: FormatOptions
): string {
  return `SAR ${formatNumber(value, options)}`;
}

export function parseNumber(input: string): number {
  return Number(String(input).replace(/,/g, "")) || 0;
}
