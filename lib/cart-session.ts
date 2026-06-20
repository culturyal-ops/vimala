const SESSION_KEY = "vimala-cart-session";

/** Returns a stable browser session token for server cart sync (8–64 chars). */
export function getOrCreateSessionToken(): string {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem(SESSION_KEY);
  if (!token || token.length < 8) {
    token = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(SESSION_KEY, token);
  }
  return token;
}

export function clearSessionToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
