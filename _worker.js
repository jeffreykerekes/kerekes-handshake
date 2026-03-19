/**
 * THE KEREKES HANDSHAKE™ PROTOCOL - WORKER v1.3
 * Single Source of Truth for jeffreykerekes.com
 * Consolidates Security, CORS, HSTS, and Canonical Redirects.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = (request.headers.get("User-Agent") || "").toLowerCase();

    // 1. CANONICAL REDIRECT: LEGACY ROOT AI-PLUGIN
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
      userAgent.includes("googlebot");

    // 3. FETCH ASSET
    let response = await env.ASSETS.fetch(request);
    let newResponse = new Response(response.body, response);

    // 4. CONSOLIDATED SECURITY HEADERS
    newResponse.headers.set("X-Content-Type-Options", "nosniff");
    newResponse.headers.set("X-Frame-Options", "DENY");
    newResponse.headers.set("X-XSS-Protection", "1; mode=block");
    newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newResponse.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    
    // HSTS (Strict Transport Security)
    if (url.hostname === "jeffreykerekes.com") {
      newResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    }

    // CONTENT SECURITY POLICY (CSP)
    const csp = "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline'; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data:; " +
                "connect-src 'self';";
    newResponse.headers.set("Content-Security-Policy", csp);

    // 5. KEREKES HANDSHAKE™ CORS & DISCOVERY
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // 6. PDF & ASSET ENFORCEMENT
    if (url.pathname.endsWith(".pdf")) {
      newResponse.headers.set("Content-Type", "application/pdf");
      newResponse.headers.set("Content-Disposition", "inline");
      newResponse.headers.set("X-Robots-Tag", "index, follow");
    }

    // 7. JSON/YAML DISCOVERY & CACHING
    if (url.pathname.endsWith(".json") || url.pathname.endsWith(".yaml") || url.pathname.includes(".well-known")) {
      newResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      if (isAIAgent) {
        newResponse.headers.set("X-Handshake-Status", "VERIFIED_AGENT_ACCESS");
      }
    }

    // 8. PRE-FLIGHT (OPTIONS) HANDLER
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: newResponse.headers
      });
    }

    return newResponse;
  }
};