import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Sanitize admin-authored rich HTML (blog content) before rendering.
 * Allowlist-based: strips scripts, event handlers and unsafe URLs; forces
 * external links to open safely.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "a", "ul", "ol", "li", "blockquote", "strong", "em",
      "code", "pre", "img", "figure", "figcaption", "hr", "br", "table", "thead",
      "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
}
