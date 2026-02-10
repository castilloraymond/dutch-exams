const SAFE_PATHS = [
  "/learn",
  "/dashboard",
  "/try",
  "/blog",
  "/guide",
  "/faq",
  "/quick-assessment",
  "/upgrade",
  "/profile",
];

/**
 * Validates a redirect path against an allowlist of safe paths.
 * Returns the path if safe, or "/learn" as a fallback.
 */
export function validateRedirect(path: string | null | undefined): string {
  if (!path || typeof path !== "string") {
    return "/learn";
  }

  // Block protocol-relative URLs, javascript:, data:, vbscript:
  if (
    path.startsWith("//") ||
    path.includes("://") ||
    path.startsWith("javascript:") ||
    path.startsWith("data:") ||
    path.startsWith("vbscript:")
  ) {
    return "/learn";
  }

  // Must start with /
  if (!path.startsWith("/")) {
    return "/learn";
  }

  // Check against allowlist (prefix match)
  const isAllowed = SAFE_PATHS.some(
    (safe) => path === safe || path.startsWith(safe + "/") || path.startsWith(safe + "?")
  );

  return isAllowed ? path : "/learn";
}
