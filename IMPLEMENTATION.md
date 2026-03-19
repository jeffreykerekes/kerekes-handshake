# Kerekes Handshake™ — Implementation Guide v1.5
**Technical reference for developers and protocol implementers.**

> *This document covers the "how to build it" details. For the protocol overview and non-technical onboarding, start with [SPEC.md](./SPEC.md). For the 5-minute deployment walkthrough, see [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md).*

---

## 1. The Four-Layer Architecture

| Layer | File(s) | Role |
|---|---|---|
| Narrative | `resume.html` | Human-readable claims tagged with `data-kcm` |
| Registry | `claims.json` | Machine-readable map: claim ID → evidence URIs |
| Markup | KCM attributes | Semantic hooks tethering narrative to registry |
| Evidence Vault | `/evidence/`, `/archive/` | Primary artifacts in twin-track (PDF + TXT) format |

---

## 2. The Twin-Track Model (AI-Ready Evidence)

The core insight of v1.5: current LLM agents have **Binary Blindness** — they frequently stall or hallucinate when encountering binary PDF streams during a live web crawl.

Every artifact must therefore exist in two formats:

- **Primary (`.pdf`):** The forensic authority for humans — preserves signatures, stamps, layout, and legal formatting.
- **Sidecar (`.txt`):** The semantic authority for AI agents — clean UTF-8 text for accurate extraction of dates, numbers, and names.

The filenames must match exactly:
```
2011-main-spreadsheet-all.pdf
2011-main-spreadsheet-all.txt   ← same name, .txt extension
```

---

## 3. Sidecar Automation (The Sidecar Loop)

Generate all `.txt` sidecars in batch using `pdftotext` (part of `poppler-utils`):

```bash
# Run inside /evidence/ and again inside /archive/
for f in *.pdf; do pdftotext "$f" "${f%.pdf}.txt"; done
```

**Install poppler-utils:**
- macOS: `brew install poppler`
- Ubuntu/Debian: `sudo apt install poppler-utils`
- Windows: Use WSL or manually export text from each PDF

**Re-run this command** whenever you add or update a PDF. The `.txt` file should always reflect the current state of its paired PDF.

---

## 4. KCM Attribute Reference

KCM (Kerekes Claim Markup) uses three HTML attributes:

### `data-kcm="[CLAIM_ID]"`
**Required.** Place on the parent container (`<article>` or `<section>`) of a professional claim. Maps the contained narrative to a specific entry in `claims.json`.

```html
<article data-kcm="budget_audit_2011" 
         aria-label="KCM Claim: budget_audit_2011"
         itemscope itemtype="https://schema.org/CreativeWork">
```

### `class="ai-hook"`
**Optional.** Identifies specific keywords, case numbers, or unique forensic pivots within claim text (e.g., `FIC 2009-014`, `$38,000 per household`). Helps AI agents locate extractable identifiers.

```html
<span class="ai-hook" title="FOI Case Number">FIC 2009-014</span>
```

### `itemprop="evidenceOrigin"`
**Optional.** Applied to evidence links within a claim to explicitly denote primary source artifacts for Schema.org structured data parsers.

```html
<a href="/evidence/foi.pdf" itemprop="evidenceOrigin">FOI Ruling</a>
```

---

## 5. `claims.json` Field Reference

| Field | Required | Description |
|---|---|---|
| `claim_id` | ✓ | Unique slug matching the `data-kcm` value (e.g., `budget_audit_2011`) |
| `title` | ✓ | Short human-readable label |
| `evidence` | ✓ | Array of absolute URIs — include both `.pdf` and `.txt` versions |
| `outcome` | ✓ | The verifiable result of the intervention |
| `domain` | | System category (Human, Civic, Physical, Ecological) |
| `description` | | Narrative summary of the intervention |

The root `claims.json` object also supports:

| Field | Description |
|---|---|
| `protocol_version` | Should match current spec version (`"1.5"`) |
| `steward` | Full name of the resume owner |
| `fingerprint` | PGP fingerprint (no spaces) |
| `last_updated` | ISO date of last edit |
| `integrity_manifest` | Absolute URL to `site_manifest.json.asc` |
| `proof` | PGP signature block over the claims content |

---

## 6. The Cryptographic Integrity Layer

### Generating `site_manifest.json`
The manifest is a JSON object mapping filenames to their SHA-256 hashes:

```bash
# Generate hashes for all evidence files
find evidence/ -type f | while read f; do
  echo "\"$f\": \"$(sha256sum "$f" | cut -d' ' -f1)\""
done
```

### Signing the manifest
```bash
gpg --clearsign site_manifest.json
# Produces: site_manifest.json.asc
```

### Verification command (for auditors)
```bash
curl -s https://[domain]/site_manifest.json.asc | gpg --verify
```

**Re-sign the manifest** every time you add, remove, or modify an evidence file. An outdated manifest is a failed integrity check.

---

## 7. AI Agent Discovery Infrastructure

### `openapi.yaml`
Defines the available endpoints for AI agents. Place at the site root. Key endpoints:
- `GET /claims.json` — the registry
- `GET /evidence/{filename}` — retrieve an artifact
- `GET /llms-full.txt` — pre-flight context
- `GET /site_manifest.json.asc` — integrity seal

### `ai-plugin.json`
Place at `/.well-known/ai-plugin.json` for autonomous agent discovery. Links to your `openapi.yaml`.

### `llms-full.txt`
A high-density plain-text index providing LLM agents with biographical context, the full archival index, and audit instructions before they begin fetching individual artifacts. Acts as a "pre-flight briefing."

### `llms.txt`
A minimal version of the above — a short disambiguation and identity anchor file at the site root.

---

## 8. The Audit Portal (`/query/`)

The query portal provides a one-click interface for humans to launch an AI audit. It contains:

1. **The Forensic Manifesto** — a pre-written system prompt that instructs the AI to traverse the full protocol chain
2. **Targeted snippet cards** — copy-paste queries for specific claims or audit types
3. **Architecture explanation** — helps non-technical visitors understand what they're looking at
4. **Protocol credit** — attribution to the Kerekes Handshake™

The manifesto prompt should instruct the AI to:
- Verify SHA-256 hashes via `site_manifest.json.asc`
- Use the Text Bridge (`.txt` sidecar) as fallback for binary PDFs
- Match `data-kcm` tags in the resume against `claims.json`
- Report each claim as VERIFIED / CONFLICT / UNSTABLE

---

## 9. Server Configuration (CORS & Headers)

AI tools from external domains (Grok, ChatGPT) require CORS to fetch your evidence files.

**Cloudflare Pages (`_headers` file):**
```
/evidence/*
  Access-Control-Allow-Origin: *
  Content-Type: application/pdf

/evidence/*.txt
  Access-Control-Allow-Origin: *
  Content-Type: text/plain; charset=utf-8
```

**Netlify (`_headers` file):** Same syntax as above.

**Cloudflare Worker (`_worker.js`):** Add CORS headers in the fetch handler for paths matching `/evidence/`.

---

## 10. Protocol Compliance Checklist

For an implementation to be considered **v1.5 Compliant**:

- [ ] **KCM Markup:** All claims in resume HTML use `data-kcm` attributes
- [ ] **Semantic Parity:** Every `data-kcm` ID has a matching entry in `claims.json`
- [ ] **Twin-Track Coverage:** 100% of PDF artifacts have a `.txt` sidecar
- [ ] **PGP Integrity:** `site_manifest.json.asc` is signed and current
- [ ] **Open Access:** CORS headers allow `*` on `/evidence/` directory
- [ ] **OpenAPI:** A valid `openapi.yaml` is accessible at the site root
- [ ] **LLM Context:** `llms-full.txt` provides agent pre-flight context

---

## 11. AI Compatibility Notes (March 2026)

| Agent | Status | Notes |
|---|---|---|
| **Grok (X.ai)** | ✓ Fully Compatible | Best-in-class live crawling; handles Text Bridge natively |
| **ChatGPT (with browsing)** | ✓ Compatible | Use Text Bridge `.txt` files; enable CORS |
| **Claude (with web tool)** | ✓ Compatible | Use Text Bridge `.txt` files; enable CORS |
| **Perplexity** | ✓ Compatible | Text Bridge recommended |
| **Claude (no web tool)** | Partial | Can read uploaded files; cannot fetch live URLs |

**Note:** AI compatibility changes rapidly. The Text Bridge (`.txt` sidecars) is the single most important mitigation for cross-agent compatibility issues.

---

*Part of the Kerekes Handshake™ Protocol — Created by Jeffrey Kerekes | jeffreykerekes.com*  
*Licensed CC BY-SA 4.0. Fork it, build on it, keep it open.*
