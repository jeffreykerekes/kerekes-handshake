# Kerekes Handshake™ Specification v1.5
**The Evidence-Backed Resume Standard for a Post-Truth AI Era.**

> *This is the condensed specification and onboarding guide. For the full whitepaper, see [Kerekes-Handshake-Whitepaper-Spec-V1.5.pdf](./Kerekes-Handshake-Whitepaper-Spec-V1.5.pdf). For the technical implementation detail including the sidecar automation command and compliance checklist, see [IMPLEMENTATION.md](./IMPLEMENTATION.md).*

---

## 0. Abstract
The **Kerekes Handshake™** is a forensic protocol designed to transform professional resumes from unverified narratives into auditable systems. It establishes a machine-readable circuit between **Narrative Claims**, **Structured Metadata**, and **Primary Artifacts**, allowing AI agents and human auditors to verify professional history with cryptographic integrity.

**Traditional resume:** Claim → Trust  
**Kerekes Handshake:** Claim → Evidence → Verification

---

## 1. The Three-Layer Forensic Stack
A compliant Handshake implementation must exist across three distinct layers:

1. **The Narrative Layer (HTML/PDF):** The human-readable resume. Claims are tagged with `data-kcm` attributes.
2. **The Registry Layer (JSON):** The `claims.json` ledger — the "map" connecting claim IDs to specific evidence URIs.
3. **The Integrity Layer (PGP):** The `site_manifest.json.asc` — a PGP-signed manifest containing SHA-256 hashes of all artifacts, providing a cryptographic Root of Trust.

---

## 2. The Text Bridge (AI Extraction Optimization)
*Born from real-world debugging, March 2026.*

Many LLM-based crawlers fail to reliably parse binary PDF streams in real-time. The solution is the **Text Bridge**: for every PDF artifact in the `/evidence/` directory, a matching `.txt` sidecar **MUST** be present (e.g., `audit_2011.pdf` → `audit_2011.txt`).

AI auditors are instructed to fail-over to the `.txt` bridge if the binary PDF is unreadable. This ensures accurate extraction of dates, numbers, and names without hallucination.

**Generate sidecars automatically** (requires `poppler-utils`):
```bash
for f in *.pdf; do pdftotext "$f" "${f%.pdf}.txt"; done
```

---

## 3. KCM (Kerekes Claim Markup)
The semantic bridge between narrative and evidence.

**Attribute:** `data-kcm="unique_claim_id"`  
**Placement:** On the parent `<article>` or `<section>` container of a professional claim.  
**Mapping:** The `unique_claim_id` must correspond to a key in the root `claims.json`.

Minimal example:
```html
<article data-kcm="budget_audit_2011">
  <h3>Municipal Budget Reconstruction</h3>
  <p>Exposed $38k per-household debt liability via manual audit.</p>
  <ul class="evidence">
    <li><a href="/evidence/2011-main-spreadsheet-all.pdf">Audit Spreadsheet</a></li>
  </ul>
</article>
```

See [KCM_SPEC.md](./KCM_SPEC.md) for the full attribute reference including `class="ai-hook"` and `itemprop="evidenceOrigin"`.

---

## 4. Cryptographic Identity Binding
The evidence vault is bound to the steward's unique identity via PGP.

- **Canonical Fingerprint:** `D39E 4ACE A4FE 3E6B 547F 58C4 6174 3446 DFA7 D48F`
- **Verify the manifest:** `$ curl -s [domain]/site_manifest.json.asc | gpg --verify`
- **Re-sign after any change:** `$ gpg --clearsign site_manifest.json`

---

## 5. Quick Start (5 Steps for Non-Developers)

**Step 1 — Collect your evidence**  
Gather your real primary-source documents: PDFs of reports, rulings, certifications, inspection records, anything that verifies a claim. Put them in a folder called `/evidence/`.

**Step 2 — Generate the Text Bridge**  
For each PDF, create a matching `.txt` version with the same filename. If you have `poppler-utils` installed, run the bash command in Section 2 above. If not, manually save a text copy of each PDF with the exact same filename (e.g., `audit.pdf` and `audit.txt`).

**Step 3 — Build your `claims.json`**  
Create a file that maps each professional claim to its evidence files. Use the [Official Schema](./kerekes_handshake_v1_schema.json) as your template. Each claim needs a `claim_id`, `title`, `evidence` array (URLs), and `outcome`.

**Step 4 — Tag your resume HTML**  
Wrap each professional claim in a `<article data-kcm="your_claim_id">` tag. This is the semantic hook that lets AI agents connect your narrative to the evidence.

**Step 5 — Deploy and verify**  
Host your files on any static host (GitHub Pages, Netlify, Cloudflare Pages — all free). Enable CORS for the `/evidence/` directory. Point your resume to your `/query/` portal with the line: *"Audit this resume with AI → [your-domain]/query"*

For the full step-by-step with commands, see [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md).

---

## 6. Implementation Requirements
To be **v1.5 Compliant**, a system must implement all five:

- [ ] **KCM Markup:** Resume HTML uses `data-kcm` attributes on all claim containers.
- [ ] **Registry:** `claims.json` maps every claim ID to at least one evidence URI.
- [ ] **Text Bridge:** 100% of PDF artifacts have a matching `.txt` sidecar.
- [ ] **Integrity Seal:** `site_manifest.json.asc` is PGP-signed and current.
- [ ] **Open Access:** CORS headers (`Access-Control-Allow-Origin: *`) enabled for `/evidence/`.

---

## 7. Technical Infrastructure (Advanced)
For production-grade AI agent support, see [IMPLEMENTATION.md](./IMPLEMENTATION.md) which covers:

- `openapi.yaml` — machine-readable API schema for agent discovery
- `_worker.js` — Cloudflare edge worker for CORS, HSTS, and AI agent detection
- `ai-plugin.json` — agent discovery manifest at `/.well-known/`
- `llms-full.txt` — high-density pre-flight context for LLM agents

---

## 8. Defensive License (CC BY-SA 4.0)
This protocol is a free public utility. You must attribute **Jeffrey Kerekes** and distribute derivatives under this same license. This prevents proprietary "walled gardens" from privatizing professional truth.

**What this means in practice:**
- **Attribution:** Credit Jeffrey Kerekes as the original architect.
- **ShareAlike:** Derivatives must use the same CC BY-SA 4.0 license.
- **No lock-in:** You cannot take this protocol proprietary.

---

*Created by Jeffrey Kerekes | Systems Practitioner | jeffreykerekes.com*
