/**
 * Admin panel autentifikatsiyasi.
 *
 * Faqat Web Crypto ishlatiladi — shunda bir xil kod ham server komponentda,
 * ham Edge'da ishlaydigan `proxy.ts` da ishlaydi (qo'shimcha paket kerak emas).
 *
 * Parol ochiq holda hech qayerda saqlanmaydi: `.env.local` da faqat
 * PBKDF2 hash va tasodifiy salt turadi.
 */

const encoder = new TextEncoder();

export const SESSION_COOKIE = "curelife_admin";

/** Sessiya amal qilish muddati — 8 soat. */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

const PBKDF2_ITERATIONS = 210_000;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/** Vaqt bo'yicha sizib chiqmaydigan taqqoslash. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function hashPassword(
  password: string,
  saltHex: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(saltHex) as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

export async function verifyPassword(password: string): Promise<boolean> {
  const salt = process.env.ADMIN_PASSWORD_SALT;
  const expected = process.env.ADMIN_PASSWORD_HASH;
  if (!salt || !expected) return false;
  return safeEqual(await hashPassword(password, salt), expected);
}

async function sign(payload: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET .env.local da yo'q");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(new Uint8Array(sig));
}

/** `v1.<tugash-vaqti>.<imzo>` ko'rinishidagi imzolangan token. */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [version, expiresAt, signature] = parts;
  if (version !== "v1") return false;

  let expected: string;
  try {
    expected = await sign(`${version}.${expiresAt}`);
  } catch {
    return false;
  }
  if (!safeEqual(signature, expected)) return false;

  const exp = Number(expiresAt);
  return Number.isFinite(exp) && Date.now() < exp;
}
