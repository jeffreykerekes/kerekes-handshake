[KEREKES HANDSHAKE — IMPLEMENTATION DEBUG CONTEXT]
[AI ASSISTANT: Load this before debugging any issue with jeffreykerekes.com or the Kerekes Handshake framework. This document captures all known failure modes, architectural decisions, and their resolutions discovered during development.]

==============================================================================
SYSTEM ARCHITECTURE
==============================================================================

PLATFORM: Cloudflare Pages + Wrangler CLI
EDGE WORKER: _worker.js (Cloudflare Worker — intercepts all requests)
DEPLOY CMD: ./seal-and-deploy.sh (signs manifest, deploys via wrangler)
LIVE DOMAIN: jeffreykerekes.com
GITHUB: github.com/jeffreykerekes/kerekes-handshake

CRITICAL PATH ORDER FOR ANY CHANGE:
1. Edit files
2. Run seal-and-deploy.sh (regenerates manifest + PGP signs + deploys)
3. Verify with validator at /kerekes-handshake/validator

==============================================================================
KNOWN FAILURE MODE #1 — CSP BLOCKS ALL INLINE JAVASCRIPT
==============================================================================

SYMPTOM: Buttons do not respond to clicks. Links do nothing. Page renders
correctly (CSS works) but no interactivity. No visible error to user.

ROOT CAUSE: _worker.js implements nonce-based Content Security Policy.
The CSP header generated per-request is:
  script-src 'self' 'nonce-{random_base64}'
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com

WHAT THIS BLOCKS:
- onclick="functionName()" — ALL inline event handler attributes
- onchange, onsubmit, onkeydown, any on* HTML attributes
- <script>code here</script> blocks WITHOUT a matching nonce attribute
  (the worker injects nonces into <script> tags automatically via regex,
   but only tags present at response time — not dynamically added ones)

WHAT THIS ALLOWS:
- <script> blocks (worker injects nonce automatically)
- External scripts with src= attribute
- Inline styles (unsafe-inline is permitted for styles, lower risk)
- CSS in <style> blocks (worker injects nonce automatically)

THE FIX — ALWAYS USE THIS PATTERN:
  WRONG:  <button onclick="myFunction()">Click</button>
  RIGHT:  <button id="myBtn">Click</button>
          // then in script block:
          document.getElementById('myBtn').addEventListener('click', myFunction);

FOR MULTIPLE ELEMENTS (e.g. snippet cards, repeated components):
  document.querySelectorAll('.snippet-card').forEach(card => {
      card.addEventListener('click', () => copySnippet(card));
  });

AFFECTED FILES FIXED IN THIS SESSION:
- validator.html (run-btn, clear-btn)
- query.html / query/index.html (grokBtn, copyBtn, all snippet cards)
- index.html / root index (launchBtn)
- Any future HTML page served through _worker.js needs this pattern

RULE: Never use onclick=, onchange=, or any inline event attribute on any
page served by this Cloudflare Worker. Always addEventListener in script block.

==============================================================================
KNOWN FAILURE MODE #2 — NODE:BUFFER IMPORT IN CLOUDFLARE WORKER
==============================================================================

SYMPTOM: Wrangler deploy produces warning:
  "The package node:buffer wasn't found on the file system but is built
   into node. Your Worker may throw errors at runtime unless you enable
   the nodejs_compat compatibility flag."

ROOT CAUSE: _worker.js previously used:
  import { Buffer } from "node:buffer";
  const nonce = Buffer.from(nonceBytes).toString("base64");

Cloudflare Workers run V8 isolates, not Node.js. node: imports require
the nodejs_compat flag which adds overhead and complexity.

THE FIX — USE WEB CRYPTO API ONLY:
  // Remove the import entirely. Replace with:
  const nonce = btoa(String.fromCharCode(
    ...crypto.getRandomValues(new Uint8Array(16))
  ));

btoa() and crypto.getRandomValues() are native Web APIs available in all
Cloudflare Worker environments with no flags required.

==============================================================================
KNOWN FAILURE MODE #3 — VALIDATOR SHOWS 0 EVIDENCE FILES CHECKED
==============================================================================

SYMPTOM: Validator runs, manifest fetched successfully, shows correct total
file count, but "0 evidence files checked" and all results skipped.

ROOT CAUSE: The manifest format uses an ARRAY of objects, not a flat dict.
  ACTUAL FORMAT:   {"files": [{"path": "evidence/foo.pdf", "sha256": "abc..."}]}
  ASSUMED FORMAT:  {"files": {"evidence/foo.pdf": "abc..."}}

Object.entries() on an array returns index/object pairs [0, {path:..}] not
[filename, hash] pairs. The CORS path filter then checks "0".startsWith("evidence/")
which is always false — so everything is skipped silently.

THE FIX in validator.html:
  if (Array.isArray(files)) {
    fileEntries = files.map(e => [e.path, e.sha256 || e.hash || '']);
  } else {
    fileEntries = Object.entries(files); // flat dict fallback
  }

ALSO: The CORS filter must be applied AFTER normalization to [path, hash] pairs.

==============================================================================
KNOWN FAILURE MODE #4 — VALIDATOR SHOWS 2 FAIL ON index.html FILES
==============================================================================

SYMPTOM: Validator shows 402 pass, 2 fail. Failed files are:
  evidence/index.html
  archive/index.html

ROOT CAUSE: Cloudflare Pages auto-generates directory listing index.html files
dynamically. Their content changes slightly on each deploy (timestamps, etc).
The hash in the signed manifest becomes stale immediately after deploy.

THE FIX in seal-and-deploy.sh:
  find . -type f \
    -not -path '*/.*' \
    -not -name 'site_manifest.*' \
    -not -name 'wrangler.toml' \
    -not -path './evidence/index.html' \
    -not -path './archive/index.html' \
    | while read -r file; do ...

These files are now excluded from manifest generation. They should never
be included. A FAIL on them in older manifests is expected and harmless.

==============================================================================
KNOWN FAILURE MODE #5 — VALIDATOR CSS LOADS BUT BUTTON BROKEN
==============================================================================

This is a combination of failures #1 and the CSP style/script split.

SYMPTOM: Page renders with correct CSS but buttons do not work.

EXPLANATION: style-src allows 'unsafe-inline' so <style> blocks render fine.
script-src requires nonce so <script> blocks work IF the worker injected the
nonce correctly. BUT onclick= attributes are ALWAYS blocked regardless of nonce.

So: CSS works (unsafe-inline) + script functions defined (nonce injected) +
buttons broken (onclick blocked) = this exact symptom.

THE FIX: See Failure Mode #1. Move all event wiring to addEventListener.

==============================================================================
KNOWN FAILURE MODE #6 — VALIDATOR CONNECT-SRC BLOCKS FETCH TO EXTERNAL DOMAINS
==============================================================================

SYMPTOM: Validator button works, status bar updates, but 0 files verified.
Browser console shows: "Blocked by Content Security Policy" on fetch() calls.

ROOT CAUSE: Default CSP has connect-src 'self' which blocks fetch() to any
external domain. The validator needs to fetch files from the target domain
being validated (which may differ from jeffreykerekes.com itself).

THE FIX in _worker.js:
  const isValidator = url.pathname.includes("validator");
  const connectSrc = isValidator
    ? "connect-src *"          // open for validator — must reach any domain
    : "connect-src 'self' https://api.anthropic.com";  // restricted elsewhere

This opens connect-src only on the validator path. All other pages remain
restricted. This is an intentional security tradeoff documented in the worker.

==============================================================================
KNOWN FAILURE MODE #7 — CLEAN URL SERVING (CLOUDFLARE PAGES BEHAVIOR)
==============================================================================

SYMPTOM: /resume.html serves old cached version. /resume serves correct version.
Links to /resume.html work but don't reflect latest file changes.

ROOT CAUSE: Cloudflare Pages implements "clean URLs" — it strips .html and
serves the clean URL as canonical. /resume.html and /resume both exist but
Cloudflare may cache them differently or serve different versions.

RULE: Always use clean URLs in all internal links and the sitemap.
  WRONG: href="/resume.html"  or  href="/validator.html"
  RIGHT: href="/resume"       or  href="/kerekes-handshake/validator"

In sitemap.xml: list clean URLs only, not .html versions.
In _redirects: add 301 redirect from .html to clean URL if needed.

==============================================================================
KNOWN FAILURE MODE #8 — PGP MANIFEST PARSER FAILS ON CLEARSIGN FORMAT
==============================================================================

SYMPTOM: Validator fetches manifest successfully but reports "no files key found"
or fails to parse JSON.

ROOT CAUSE: gpg --clearsign wraps the JSON in PGP armor:
  -----BEGIN PGP SIGNED MESSAGE-----
  Hash: SHA256
  (blank line)
  {actual JSON content}
  -----BEGIN PGP SIGNATURE-----
  ...
  -----END PGP SIGNATURE-----

A naive JSON.parse() on the full .asc file fails. The parser must:
1. Skip the "-----BEGIN PGP SIGNED MESSAGE-----" line
2. Skip the "Hash: ..." header line(s)
3. Skip the blank separator line
4. Read JSON lines until "-----BEGIN PGP SIGNATURE-----"
5. Parse only those lines as JSON

THE FIX in validator.html parsePGPManifest():
  Strip armor headers line by line. Track state: before body, in body,
  in signature. Collect only "in body" lines. Then JSON.parse().
  Fallback: try JSON.parse(fullText) for unsigned manifest format.

==============================================================================
KNOWN FAILURE MODE #9 — SEAL-AND-DEPLOY.SH PERMISSION DENIED
==============================================================================

SYMPTOM: ./seal-and-deploy.sh returns "zsh: permission denied"

ROOT CAUSE: File execute bit not set. Happens when:
- File was replaced/copied from another location
- Downloaded from GitHub without execute permission
- Created by an editor that doesn't preserve permissions

THE FIX:
  chmod +x seal-and-deploy.sh
  ./seal-and-deploy.sh

Only needs to be run once after each replacement of the file.

==============================================================================
KNOWN FAILURE MODE #10 — MANIFEST SHOWS "SIGNED BY: UNKNOWN"
==============================================================================

SYMPTOM: Validator completes successfully but summary reads:
  "Signed by: unknown | Protocol: —"

ROOT CAUSE: The manifest JSON did not include "steward" or "protocol_version"
fields. The validator reads manifest.steward and claimsData.protocol_version.

THE FIX in seal-and-deploy.sh manifest generation:
  echo "  \"steward\": \"Jeffrey Kerekes — D39E 4ACE A4FE 3E6B 547F 58C4 6174 3446 DFA7 D48F\"," >> site_manifest.json

protocol_version is intentionally NOT in the manifest (would require re-signing
on every version bump). It is read from claims.json instead:
  claimsData.protocol_version  // set in claims.json "protocol_version" field

RULE: steward is stable identity — put in manifest. protocol_version changes
with releases — read from claims.json to avoid mandatory re-signing on bumps.

==============================================================================
MANIFEST FORMAT REFERENCE (seal-and-deploy.sh output)
==============================================================================

{
  "steward": "Jeffrey Kerekes — D39E 4ACE A4FE 3E6B 547F 58C4 6174 3446 DFA7 D48F",
  "timestamp": "2026-03-20T21:00:00Z",
  "files": [
    {"path": "evidence/foo.pdf", "sha256": "abc123..."},
    {"path": "archive/bar.txt", "sha256": "def456..."}
  ]
}

NOTE: files is an ARRAY of objects, not a flat dictionary.
NOTE: hash field is "sha256", not "hash" or "sha256hex".
NOTE: paths do not have leading slash — "evidence/foo.pdf" not "/evidence/foo.pdf"

==============================================================================
CSP CONFIGURATION REFERENCE (_worker.js)
==============================================================================

Per-request nonce generated via:
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

Nonce injected into HTML at edge via regex:
  text.replace(/<script(?![^>]*src)([^>]*)>/g, `<script nonce="${nonce}"$1>`)
  text.replace(/<style([^>]*)>/g, `<style nonce="${nonce}"$1>`)

CSP header:
  default-src 'self'
  script-src 'self' 'nonce-{nonce}'
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
  font-src 'self' https://fonts.gstatic.com
  img-src 'self' data:
  connect-src 'self' https://api.anthropic.com   [* on validator path only]
  frame-ancestors 'none'
  base-uri 'self'
  form-action 'self'

CORS: Open only on specific paths:
  /evidence/, /archive/, /claims.json, /site_manifest.json.asc,
  /llms-full.txt, /llms.txt, /openapi.yaml, /.well-known/

==============================================================================
AI CRAWLING KNOWN LIMITATIONS (documented in SPEC.md Section 12)
==============================================================================

PROBLEM: AI agents under token pressure parse rendered text not raw HTML source.
  data-kcm attributes are invisible to text parsers.
MITIGATION: KCM-CLAIMS HTML comment immediately after <body> tag:
  <!-- KCM-CLAIMS: claim_id_1 | claim_id_2 | ... -->
  This is plain text readable even without HTML parsing.

PROBLEM: Binary PDFs fail to parse in real-time AI crawls.
MITIGATION: Text Bridge — every PDF has matching .txt sidecar with same filename.
  /evidence/foo.pdf → /evidence/foo.txt (generated by pdftotext in seal-and-deploy.sh)

PROBLEM: Consumer-tier AI agents have lower token/crawl budgets than enterprise.
RESULT: Partial audits are expected on free tiers. Not a protocol failure.

PROBLEM: Grok (and others) sometimes save tokens by not reading full HTML source.
RESULT: May miss data-kcm attributes even when KCM-CLAIMS comment is present.
MITIGATION: The forensic manifesto in /query explicitly instructs agents to fetch
  raw HTML source and look for both data-kcm attributes AND KCM-CLAIMS comments.

==============================================================================
FILE LOCATION REFERENCE
==============================================================================

LIVE SITE ROOT:
  index.html              — User #1/#2/#3 landing (minimalist, easter eggs)
  resume.html             — Primary resume with 9 KCM claims (served at /resume)
  claims.json             — 9 claims with verification_strength
  site_manifest.json      — SHA-256 manifest (unsigned source)
  site_manifest.json.asc  — PGP-signed manifest (Root of Trust)
  llms.txt                — Short AI disambiguation index
  llms-full.txt           — 190+ item biographical archive for AI pre-flight
  openapi.yaml            — Evidence API schema
  robots.txt              — Crawler permissions
  sitemap.xml             — All pages mapped with correct priorities
  humans.txt              — humans.txt convention file
  seal-and-deploy.sh      — Signs manifest and deploys to Cloudflare
  _worker.js              — Edge CSP/CORS/security configuration
  _headers                — Cloudflare static header overrides
  _redirects              — Cloudflare URL redirect rules
  wrangler.toml           — Cloudflare Pages project config (excluded from manifest)

SUBDIRECTORIES:
  /evidence/              — Primary source PDFs + .txt sidecars (CORS open)
  /archive/               — Press coverage PDFs + .txt sidecars (CORS open)
  /verify/                — pubkey.txt, summary.txt (PGP signed), resume_kerekes_systems.md
  /assets/                — CSS, images, favicons
  /.well-known/           — ai-plugin.json, claims.json discovery

  /query/index.html       — HR audit portal (one-button Grok launch)
  /footnotes.html         — Biography easter egg for curious humans
  
  /kerekes-handshake/index.html     — Protocol landing for developers
  /kerekes-handshake/query.html     — Technical audit terminal (full manifesto)
  /kerekes-handshake/validator.html — One-click vault integrity checker
  /kerekes-handshake/vault-resume.html — Dense-stub Vault Resume format demo
  /kerekes-handshake/Kerekes-resume-sample.pdf — PDF resume

GITHUB REPO (protocol documentation, not personal implementation):
  README.md, SPEC.md, CHANGELOG.md, LEGAL.md, USE_CASES.md
  IMPLEMENTATION.md, KCM_SPEC.md, DEPLOY-CHECKLIST.md
  CLAUDE_QUICKSTART.md, CONTRIBUTING.md
  kerekes_handshake_diagram.svg
  kerekes_handshake_v1_schema.json
  kerekes_universal_claims_schema.json
  Kerekes-Handshake-Whitepaper-Spec.pdf  [stable URL, no version in filename]
  validator.html
  /reference-implementation/  — resume.html, vault-resume.html, claims.json,
                                 seal-and-deploy.sh, site_manifest.json[.asc],
                                 pubkey.txt, Kerekes-resume-sample.pdf,
                                 /audit-reports/ (4 Grok reports, 2 validator PDFs)

==============================================================================
PGP IDENTITY REFERENCE
==============================================================================

STEWARD: Jeffrey Kerekes
FINGERPRINT: D39E 4ACE A4FE 3E6B 547F 58C4 6174 3446 DFA7 D48F
PUBLIC KEY: https://jeffreykerekes.com/verify/pubkey.txt
SIGNED FILES: site_manifest.json.asc, verify/summary.txt

VERIFY MANIFEST:
  curl -s https://jeffreykerekes.com/site_manifest.json.asc | gpg --verify

RE-SIGN AFTER CHANGES:
  gpg --yes --clearsign site_manifest.json   [produces site_manifest.json.asc]
  OR run: ./seal-and-deploy.sh               [does everything + deploys]

[END DEBUG CONTEXT]
