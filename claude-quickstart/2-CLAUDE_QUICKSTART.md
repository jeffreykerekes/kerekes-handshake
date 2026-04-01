# Kerekes Handshake — Claude Quickstart

Build a complete, v1.6 compliant evidence-anchored website in one Claude session.
No coding required. Upload your files, paste the prompt, let Claude build it.

> **Note:** This file is designed to be uploaded directly to Claude alongside your source documents.
> Claude will parse it as build instructions. You do not need to read all of it.

---

## What You Need Before Starting

**Upload these files to Claude in this order:**

1. `KEREKES_HANDSHAKE_DEBUG.md` — Technical constraints and all known failure modes. Claude reads this first.
2. `CLAUDE_QUICKSTART.md` — This file.
3. `_worker.js` — Production-hardened Cloudflare Worker. Tell Claude not to regenerate it.
4. `SPEC.md` — Protocol specification for v1.6 compliance.
5. Your PDF source documents — the evidence files.

---

## The Prompt

Copy this exactly. Fill in the brackets.

```
I am uploading the following files:
1. KEREKES_HANDSHAKE_DEBUG.md — read this first for all technical constraints
2. CLAUDE_QUICKSTART.md — build instructions
3. _worker.js — use as-is, do not regenerate
4. SPEC.md — follow for v1.6 compliance
5. [List your PDFs here]

Build a Kerekes Handshake v1.6 compliant website for the uploaded documents.

AUDIENCE: [e.g. "250+ property owners, non-technical, average reading level"
           or "HR recruiters evaluating a resume"]

BUILD THESE FILES:
- audit.html — main page with one-click Grok audit button
- query/index.html — full audit portal with manifesto and quick questions
- evidence/index.html — evidence vault directory listing
- claims.json — v1.6 claims registry with verification_strength scores
- site_manifest.json — SHA-256 template with signing instructions

OPTIONAL (only if I have no existing index.html):
- A root index.html that redirects to /audit.html

Follow ALL constraints in KEREKES_HANDSHAKE_DEBUG.md, especially:
- Never use onclick= or inline event attributes (Failure Mode #1)
- Use the provided _worker.js as-is, do not regenerate it
- All evidence files belong in /evidence/
- claims.json and site_manifest.json.asc must be at root
- Grok button must use: window.open('https://grok.com/chat?q=' + encodeURIComponent(MANIFESTO))
- The manifesto must tell Grok to FETCH documents from vault URLs — do not ask users to upload
- Include visible plain-text KCM-CLAIMS line at bottom of every resume/proposal page (Failure Mode #12)

Output every file completely so I can deploy without additional work.
```

---

## Design Principles

Tell Claude this if your audience is non-technical:

> "Design for a middle-school reading level. Main points large and clear. Supporting
> technical detail in smaller or lighter text — not hidden, just secondary.
> One big button is better than a page of instructions.
> Kerekes Handshake branding: one small footer link only."

**What works:**
- One prominent Grok button above the fold
- Quick questions as clickable cards (tap to copy, paste into any AI)
- Manual upload steps in a collapsed accordion — visible only if needed
- Protocol terms (KCM, PGP, SHA-256) in footer or secondary sections only

**What does not work:**
- Step 1 / Step 2 / Step 3 instructions as the primary UI — hide in accordion
- Multiple buttons of equal visual weight
- Protocol jargon in headings or the main call to action

---

## How the Grok Button Works

```javascript
window.open('https://grok.com/chat?q=' + encodeURIComponent(MANIFESTO), '_blank', 'noopener');
```

**Grok is the only major AI that supports URL-based prompt pre-loading (March 2026).**
ChatGPT, Claude, Gemini, and Perplexity do not. Quick question cards (copy-to-clipboard)
serve those users. Do not promise one-click for non-Grok AIs.

The manifesto must tell Grok to **fetch documents from URLs**, not ask users to upload:

```
EVIDENCE VAULT — fetch these documents directly:
1. https://yourdomain.com/evidence/document.pdf
   Text Bridge fallback: https://yourdomain.com/evidence/document.txt
...
Claims registry: https://yourdomain.com/claims.json
```

---

## File Architecture

See `DEPLOY.md` for the full annotated folder structure. Summary:

```
/                    ← Root — infrastructure only (cannot be moved)
    audit.html       ← Main user entry point
    query/
        index.html   ← Full audit portal
    evidence/
        *.pdf        ← Source documents
        *.txt        ← Text Bridge sidecars
        index.html   ← Vault directory
    claims.json      ← MUST be at root
    site_manifest.json.asc  ← MUST be at root
    _worker.js       ← MUST be at root
    wrangler.toml    ← MUST be at root
```

**If you already have an `index.html`:** add a link to `/audit.html` from it. Do not replace it.
**If you have no `index.html`:** ask Claude to generate a simple redirect (see prompt above).

---

## Deployment Checklist

```
□ PDFs placed in /evidence/
□ .txt sidecars generated:
    cd evidence/ && for f in *.pdf; do pdftotext "$f" "${f%.pdf}.txt"; done
□ claims.json created (by Claude or manually)
□ All placeholder domains replaced with your actual domain
□ PGP key set up:
    gpg --gen-key
    gpg --fingerprint your@email.com
□ Steward name + fingerprint updated in seal-and-deploy.sh
□ Cloudflare bot protection disabled (see below)
□ ./seal-and-deploy.sh runs clean
□ Test: Grok button opens with prompt pre-loaded
□ Test: Quick question cards copy to clipboard
□ Test: Validator at jeffreykerekes.com/kerekes-handshake/validator
□ Test: Visible KCM-CLAIMS text line present at bottom of every resume/proposal page
```

---

## Cloudflare Setup (First Time)

1. Install Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. **Create a new Pages project in Cloudflare dashboard first** — note the exact project name.
4. Configure `wrangler.toml`:
   ```toml
   name = "your-cloudflare-project-name"
   pages_build_output_dir = "."
   compatibility_date = "2026-03-16"
   ```
5. **Point your domain** to the Pages project in Cloudflare DNS — this is a separate step from deploying.

**`_worker.js` cannot be uploaded via the Cloudflare web interface** (static files only).
It requires Wrangler CLI. Without it the site works but has no CSP hardening or scoped CORS.
Acceptable for private/internal sites; not recommended for public deployments.

---

## Disable Cloudflare Bot Protection — Required for AI Crawlers

Cloudflare's default security settings block AI agents like Grok from fetching your
evidence files. This must be done before testing the Grok audit.

**Symptom:** Grok opens and the prompt loads, but returns "cannot access" on evidence URLs.

**Disable these in Cloudflare Dashboard → Security:**

1. **Security → Bots → Bot Fight Mode** — disable
2. **Security → Settings → Browser Integrity Check** — disable
3. **Security → Settings → Hotlink Protection** — disable if enabled
4. **Firewall Rules** — check for any rules blocking non-browser user agents

**Test access:** Paste an evidence URL directly into Grok:
`Please fetch: https://yourdomain.com/evidence/your-document.txt`
If Grok returns text content, the vault is accessible.

You can explore re-enabling specific protections after confirming the audit works,
but `/evidence/` must remain open to AI user agents.

---

## Wrangler Preview URL — Expected Behavior

Each `./seal-and-deploy.sh` run generates a **new** temporary preview URL. This is normal —
always test using your **custom domain**, not the preview URL. The preview URL changes every deploy.

### Blank Page on First Visit

**Most likely cause:** You are using a stale preview URL from a previous deploy.
Use the new preview URL or your custom domain instead.

**Other cause:** No `index.html` at root — Cloudflare has nothing to serve at `/`.

If you want `/` to redirect to `/audit.html` without editing HTML, add a root `index.html`:
```html
<!DOCTYPE html><html><head>
<meta http-equiv="refresh" content="0; url=/audit.html">
</head></html>
```
Or add `/ /audit.html 302` to `_redirects`.

This redirect is optional if your existing `index.html` already links to `/audit.html`,
or if you don't need `/` to work at all.

---

## What seal-and-deploy.sh Does and Does Not Do

**Does:**
1. Generates `.txt` sidecars for any PDFs missing them in `/evidence/`
2. Generates `site_manifest.json` with real SHA-256 hashes
3. PGP-signs it → `site_manifest.json.asc`
4. Deploys via `wrangler pages deploy .`

**Does not** create `claims.json`, HTML files, or `wrangler.toml` — those must exist first.

**Signing without deploying:** Steps 1–3 complete even if Wrangler is not configured.
Step 4 fails gracefully. Upload files manually via Cloudflare dashboard afterward.
Note: `_worker.js` still requires Wrangler CLI — it cannot be drag-and-dropped.

---

## Known Issues Quick Reference

| Symptom | Cause | Fix |
|---|---|---|
| Buttons do nothing | CSP blocks `onclick=` | Use `addEventListener` — never `onclick=` |
| Grok opens but prompt empty | Missing `?q=` in URL | `grok.com/chat?q=` + `encodeURIComponent()` |
| Grok can't fetch vault | Cloudflare bot protection | Disable Bot Fight Mode + Browser Integrity Check |
| Validator shows 0 files | Manifest is array not dict | `Array.isArray()` check before parsing |
| node:buffer Wrangler warning | Wrong Node import | Use `btoa()` instead of `Buffer.from()` |
| Blank page on first visit | Stale preview URL or no root index | Use new preview URL or add redirect |
| Permission denied on .sh | Execute bit not set | `chmod +x seal-and-deploy.sh` |
| Validator shows 2 FAILs | evidence/index.html in manifest | Exclude `./evidence/index.html` in seal-and-deploy.sh |
| "Signed by: unknown" | No steward field in manifest | Add steward line to seal-and-deploy.sh |
| AI auditor 415 error on .asc | Server defaults to octet-stream | Add `_headers` file forcing `Content-Type: text/plain` |
| @Grok on X misses KCM markup | Lighter crawler reads rendered text only | Add visible plain-text KCM-CLAIMS line at page bottom |
| Live site stale after push | GitHub Pages cron lag | Use `on: push` trigger or force with empty commit |

Full details for every failure mode: `KEREKES_HANDSHAKE_DEBUG.md`

---

## Optional Files (Not Required for v1.6 Compliance)

| File | Purpose | When to add |
|---|---|---|
| `llms.txt` | Short AI context index | Public sites wanting AI discoverability |
| `llms-full.txt` | Full document/biographical index | Resume implementations |
| `/.well-known/ai-plugin.json` | AI plugin discovery | Public sites |
| `/openapi.yaml` | Evidence API schema | Public sites |

For internal/governance sites (like a homeowners association), skip all of these.
For public resume implementations, add them.

---

## What This Framework Does and Does Not Do

**Does:** Raise the cost of lying. Anchor claims to primary artifacts. Give anyone
a one-click way to verify claims with AI. Create a cryptographically timestamped
record of deliberate representation.

**Does not:** Prevent fraud. Guarantee AI accuracy. Replace legal counsel.

*Self-certification is self-lying. This framework raises the cost of lying. It is not a guarantee.*

---

*Kerekes Handshake — Evidence Anchoring Framework | CC BY-SA 4.0*
*Jeffrey Kerekes | jeffreykerekes.com | github.com/jeffreykerekes/kerekes-handshake*
