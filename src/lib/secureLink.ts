/**
 * Secure Link Utilities
 * Ensures external links have proper security attributes
 */

/**
 * Check if a URL is external (not same origin)
 */
export function isExternalLink(href: string): boolean {
  if (!href) return false;

  // Check for absolute URLs
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const url = new URL(href);
      const currentOrigin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://www.abishek-maharajan.online";

      return url.origin !== currentOrigin;
    } catch {
      return false;
    }
  }

  // Relative URLs are internal
  return false;
}

/**
 * Get secure link props for external links
 * Adds rel="noopener noreferrer" and target="_blank"
 */
export function getSecureLinkProps(href: string): {
  target?: string;
  rel?: string;
} {
  if (isExternalLink(href)) {
    return {
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return {};
}

/**
 * Sanitize URL to prevent XSS attacks
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  // Block javascript: and data: protocols
  const dangerousProtocols = ["javascript:", "data:", "vbscript:"];
  const lowerUrl = url.toLowerCase().trim();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return "";
    }
  }

  return url;
}
