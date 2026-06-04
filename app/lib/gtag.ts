/** GA4 이벤트 헬퍼 — GA ID 없어도 안전하게 호출 가능 */
export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", name, params ?? {});
  }
}
