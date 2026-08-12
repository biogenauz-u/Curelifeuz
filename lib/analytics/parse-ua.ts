/**
 * User-Agent'dan taxminiy Qurilma/Brauzer/OS aniqlash — tashqi kutubxonasiz.
 * 100% aniq emas, lekin admin statistikasi uchun yetarli.
 */

export function parseDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet(?!.*mobile)|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|windows phone|android.*mobile/i.test(ua)) return "mobile";
  if (/android/i.test(ua)) return "tablet";
  return "desktop";
}

export function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/telegram/i.test(ua)) return "Telegram";
  if (/(chrome|crios)\//i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Boshqa";
}

export function parseOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod|ios/i.test(ua)) return "iOS";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Boshqa";
}
