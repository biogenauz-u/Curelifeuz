/**
 * Admin parolini o'zgartiradi (.env.local ni yangilaydi).
 *
 *   npm run admin:password              → tasodifiy kuchli parol yaratadi
 *   npm run admin:password -- "MyPass"  → berilgan parolni o'rnatadi
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ENV_PATH = path.resolve(process.cwd(), ".env.local");
const ITERATIONS = 210_000;

function randomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let raw = "";
  for (let i = 0; i < 20; i++) {
    raw += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return raw.match(/.{1,5}/g).join("-");
}

const password = process.argv[2] || randomPassword();
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto
  .pbkdf2Sync(password, Buffer.from(salt, "hex"), ITERATIONS, 32, "sha256")
  .toString("hex");

let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";

const upsert = (key, value) => {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  env = re.test(env) ? env.replace(re, line) : `${env.trimEnd()}\n${line}\n`;
};

upsert("ADMIN_USERNAME", process.env.ADMIN_USERNAME || "admin");
upsert("ADMIN_PASSWORD_SALT", salt);
upsert("ADMIN_PASSWORD_HASH", hash);
if (!/^ADMIN_SESSION_SECRET=.+$/m.test(env)) {
  upsert("ADMIN_SESSION_SECRET", crypto.randomBytes(32).toString("hex"));
}

fs.writeFileSync(ENV_PATH, env.startsWith("#") ? env : env.trimStart() + "\n");

console.log("\n  Admin paroli yangilandi (.env.local)\n");
console.log("  Login: " + (process.env.ADMIN_USERNAME || "admin"));
console.log("  Parol: " + password + "\n");
console.log("  Serverni qayta ishga tushiring: npm run dev\n");
