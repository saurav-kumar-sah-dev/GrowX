/**
 * Render / .env often store PEM as one line with \n escapes, or wrapped in quotes.
 */
export function normalizeFirebasePrivateKey(raw) {
  if (!raw || typeof raw !== "string") return "";
  let k = raw.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1).trim();
  }
  return k.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
}
