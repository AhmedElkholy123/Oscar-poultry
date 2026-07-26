const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(signature);
}

export async function createSessionCookie(secret) {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const signature = await sign(secret, String(expiry));
  const value = encodeURIComponent(`${expiry}.${signature}`);
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function isSessionValid(request, secret) {
  if (!secret) {
    return false;
  }

  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));

  if (!match) {
    return false;
  }

  const [expiryStr, signature] = decodeURIComponent(match[1]).split(".");
  const expiry = Number(expiryStr);

  if (!expiry || !signature || Number.isNaN(expiry)) {
    return false;
  }

  if (expiry < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = await sign(secret, String(expiry));
  return expectedSignature === signature;
}
