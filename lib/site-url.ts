/** Public site origin for auth redirects and SEO. */
export function getSiteUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://vimalasilks.com"
  );
}

export function getAuthCallbackUrl(next = "/account") {
  const base = getSiteUrl();
  const path = `/auth/callback?next=${encodeURIComponent(next)}`;
  return `${base}${path}`;
}
