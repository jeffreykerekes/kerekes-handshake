/**
 * KEREKES HANDSHAKE - WORKER v1.6.1
 * jeffreykerekes.com edge configuration
 * Security: CSP hardened — nonce-based scripts, unsafe-inline styles (low risk), open connect-src on validator
 * CORS: Open on /evidence/ and /archive/ for AI agent access
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = (request.headers.get("User-Agent") || "").toLowerCase();

    // 1. CANONICAL REDIRECT: LEGACY AI-PLUGIN PATH
    if (url.pathname === "/ai-plugin.json") {
      return new Response(null, {
        status: 301,
        headers: {
          "Location": `${url.origin}/.well-known/ai-plugin.json`,
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
        }
      });
    }

    // 2. IDENTIFY AI AGENTS
    const isAIAgent =
      userAgent.includes("gptbot") ||
      userAgent.includes("chatgpt-user") ||
      userAgent.includes("perplexitybot") ||
      userAgent.includes("bingbot") ||
      userAgent.includes("googlebot") ||
      userAgent.includes("grok");

    // 3. GENERATE CSP NONCE for this request
    // Nonce eliminates need for unsafe-inline while allowing inline scripts
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

    // 4. FETCH ASSET
    let response = await env.ASSETS.fetch(request);

    // 5. For HTML responses, inject nonce into inline scripts and styles
    let body = response.body;
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("text/html")) {
      const text = await response.text();
      // Inject nonce into inline <script> tags (no src attribute)
      let patched = text.replace(/<script(?![^>]*src)([^>]*)>/g,
        `<script nonce="${nonce}"$1>`);
      // Inject nonce into inline <style> tags
      patched = patched.replace(/<style([^>]*)>/g,
        `<style nonce="${nonce}"$1>`);
      body = patched;
    }

    let newResponse = new Response(body, response);

    // 6. SECURITY HEADERS
    newResponse.headers.set("X-Content-Type-Options", "nosniff");
    newResponse.headers.set("X-Frame-Options", "DENY");
    newResponse.headers.set("X-XSS-Protection", "1; mode=block");
    newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newResponse.headers.set("Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), interest-cohort=()");

    // HSTS
    if (url.hostname === "jeffreykerekes.com") {
      newResponse.headers.set("Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload");
    }

    // CSP: nonce-based for scripts, unsafe-inline fallback for styles
    // connect-src: open on validator page so it can fetch any domain being validated
    const isValidator = url.pathname.includes("validator");
    const connectSrc = isValidator
      ? "connect-src *"
      : "connect-src 'self' https://api.anthropic.com";

    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      connectSrc,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ");
    newResponse.headers.set("Content-Security-Policy", csp);

    // 7. CORS — open on evidence and archive paths for AI agent access
    // This is intentional: AI agents from external domains need these files
    const needsCORS =
      url.pathname.startsWith("/evidence/") ||
      url.pathname.startsWith("/archive/") ||
      url.pathname.endsWith("/claims.json") ||
      url.pathname.endsWith("/site_manifest.json.asc") ||
      url.pathname.endsWith("/llms-full.txt") ||
      url.pathname.endsWith("/llms.txt") ||
      url.pathname.includes("/.well-known/");

    if (needsCORS) {
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }

    // 8. PDF HANDLING
    if (url.pathname.endsWith(".pdf")) {
      newResponse.headers.set("Content-Type", "application/pdf");
      newResponse.headers.set("Content-Disposition", "inline");
      newResponse.headers.set("X-Robots-Tag", "index, follow");
    }

    // 9. JSON / YAML — no-cache for integrity-sensitive files
    if (url.pathname.endsWith(".json") ||
        url.pathname.endsWith(".yaml") ||
        url.pathname.endsWith(".asc") ||
        url.pathname.includes("/.well-known/")) {
      newResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      if (isAIAgent) {
        newResponse.headers.set("X-Handshake-Status", "VERIFIED_AGENT_ACCESS");
      }
    }

    // 10. PRE-FLIGHT OPTIONS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: newResponse.headers
      });
    }

    return newResponse;
  }
};
