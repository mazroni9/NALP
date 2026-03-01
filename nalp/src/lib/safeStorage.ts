/**
 * Safe browser APIs — only call from useEffect or event handlers.
 * No usage at module scope.
 */

export function safeReadStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeWriteStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function safeRemoveStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function safeCopyToClipboard(text: string): void {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  try {
    void navigator.clipboard.writeText(text);
  } catch {}
}

export function safeReload(): void {
  if (typeof window === "undefined") return;
  try {
    window.location.reload();
  } catch {}
}

export function safeGetLocationHref(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.location.href;
  } catch {
    return "";
  }
}
