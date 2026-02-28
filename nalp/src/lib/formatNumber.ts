/** تنسيق أرقام العملة: فواصل + SAR (مثال: 2,299,500 SAR) */
export function formatSAR(value: number): string {
  return `${value.toLocaleString("en-US")} SAR`;
}
