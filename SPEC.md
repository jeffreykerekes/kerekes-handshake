# Kerekes Handshake™ Specification v1.6
**The Universal Verification Standard for a Post-Truth AI Era.**

> *This is the condensed specification. For the full whitepaper, see [Kerekes-Handshake-Whitepaper-Spec-V1.6.pdf](./Kerekes-Handshake-Whitepaper-Spec-V1.6.pdf). For technical implementation detail, see [IMPLEMENTATION.md](./IMPLEMENTATION.md). For domain-specific applications, see [USE_CASES.md](./USE_CASES.md).*

---

## 0. Abstract

The **Kerekes Handshake™** is a universal forensic protocol designed to shift trust away from opaque intermediaries, subjective summaries, and AI-optimized narratives — toward transparent, inspectable evidence.

**Traditional trust:** Claim → Narrative → Guess  
**Kerekes Handshake:** Claim → Evidence → Verification  
**Vault Resume (v1.6):** Claim stub → AI audit → Evidence vault → Verdict

The protocol is **domain-agnostic**. The same architecture that verifies a resume verifies a plumber's license, a property's condition history, or a politician's voting record.

```
Actor → Claim → Artifact Vault → Verification
```

---

## 1. The Three-Layer Forensic Stack

A compliant Handshake implementation must exist across three distinct layers:

1. **The Narrative Layer (HTML/PDF):** The human-readable summary. Claims are tagged with `data-kcm` attributes.
2. **The Registry Layer (JSON):** The `claims.json` ledger — maps each claim ID to specific evidence URIs.
3. **The Integrity Layer (PGP):** The `site_manifest.json.asc` — a PGP-signed manifest containing SHA-256 hashes of all artifacts. The cryptographic Root of Trust.

---

## 2. The Text Bridge (AI Extraction Optimization)
*Born from real-world debugging, March 2026.*

Many LLM-based crawlers fail to reliably parse binary PDF streams in real-time. The solution is the **Text Bridge**: for every PDF artifact in the `/evidence/` directory, a matching `.txt` sidecar **MUST** be present.

AI auditors fail-over to the `.txt` bridge if the binary PDF is unreadable. This ensures accurate extraction of dates, numbers, and names without hallucination.

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

```html
<article data-kcm="budget_audit_2011">
  <h3>Municipal Budget Reconstruction</h3>
  <p>Exposed $38k per-household debt liability via manual audit.</p>
  <ul class="evidence">
    <li><a href="/evidence/2011-main-spreadsheet-all.pdf">Audit Spreadsheet</a></li>
  </ul>
</article>
```

See [KCM_SPEC.md](./KCM_SPEC.md) for the full attribute reference.

---

## 4. Cryptographic Identity Binding

The evidence vault is bound to the steward's unique identity via PGP.

- **Verify the manifest:** `$ curl -s [domain]/site_manifest.json.asc | gpg --verify`
- **Re-sign after any change:** `$ gpg --clearsign site_manifest.json`

---

## 5. Quick Start (5 Steps for Non-Developers)

**Step 1 — Collect your evidence**  
Gather primary-source documents: permits, rulings, certifications, inspection records, financial audits — whatever verifies the claims you make.

**Step 2 — Generate the Text Bridge**  
For each PDF, create a matching `.txt` sidecar with the same filename. Run the bash command in Section 2 above, or manually copy-paste text with the same filename.

**Step 3 — Build your `claims.json`**  
Map each claim to its evidence files. Use the [Resume Schema](./kerekes_handshake_v1_schema.json) or the [Universal Claims Schema](./kerekes_universal_claims_schema.json) depending on your use case.

**Step 4 — Tag your HTML**  
Wrap each claim in `<article data-kcm="your_claim_id">`. This is the semantic hook AI agents use to connect narrative to evidence.

**Step 5 — Deploy and verify**  
Host on any static host (GitHub Pages, Netlify, Cloudflare Pages). Enable CORS for `/evidence/`. Add the audit link: *"Audit this with AI → [your-domain]/query"*

---

## 6. Implementation Requirements

**v1.5 Compliant:**
- [ ] KCM Markup: Resume HTML uses `data-kcm` on all claim containers
- [ ] Registry: `claims.json` maps every claim ID to at least one evidence URI
- [ ] Text Bridge: 100% of PDF artifacts have a matching `.txt` sidecar
- [ ] Integrity Seal: `site_manifest.json.asc` is PGP-signed and current
- [ ] Open Access: CORS headers enabled for `/evidence/`

**v1.6 Compliant** (superset of v1.5):
- [ ] All v1.5 requirements above
- [ ] Vault Resume Format: Narrative Layer uses dense-stub presentation (see Section 9)
- [ ] Universal Schema: `claims.json` uses the universal actor/claim/evidence structure where applicable (see Section 10)

---

## 7. Technical Infrastructure (Advanced)

For production-grade AI agent support, see [IMPLEMENTATION.md](./IMPLEMENTATION.md) which covers `openapi.yaml`, `_worker.js`, `ai-plugin.json`, and `llms-full.txt`.

---

## 8. Defensive License (CC BY-SA 4.0)

This protocol is a free public utility. You must attribute **Jeffrey Kerekes** and distribute derivatives under this same license. No walled gardens.

---

## 9. The Vault Resume — Presentation Layer Standard (v1.6)

### Philosophy
The Vault Resume resolves the core tension in modern hiring: recruiters scan in six seconds, but AI can audit in sixty. Stop explaining in prose. Put the wins on a dense half-page. Let AI pull the vault.

```
HUMAN LAYER (half-page):   Dense stubs → six-second scan → "worth a query"
                                         ↓
AI LAYER (infinite vault):  Fetch evidence → verify claims → return verdict
```

### Stub Format
```
[Domain]: [role/intervention], [key metric], [date range] — REF: [claim_id]
```

**Example:**
```
Civic: Municipal budget audit, $38k/household debt exposed, FIC 2009-014 secured, 2007–2011 — REF: budget_audit_2007_2011
```

### Rules
- One line per claim — no paragraph prose
- Lead with the metric or outcome
- Always end with `REF: [claim_id]`
- No adjectives — the evidence qualifies the claim

### v1.6 Upgrade Path
v1.6 is a presentation layer addition only. No infrastructure changes required to upgrade from v1.5. Reformat the resume HTML to use dense stubs. Done.

---

## 10. Universal Claims Standard (v1.6)

The Kerekes Handshake™ is not limited to resumes. The same protocol applies to any actor making any verifiable claim.

### The Universal Circuit
```
Actor → Claim → Artifact Vault → Verification
```

- **Actor:** Person, company, organization, product, or property
- **Claim:** The specific statement being asserted
- **Artifact Vault:** Primary, raw evidence (PDFs, datasets, permits, recordings)
- **Verification:** Human or AI agent auditing the vault directly

### The Universal Schema
The [kerekes_universal_claims_schema.json](./kerekes_universal_claims_schema.json) extends the resume schema to support:

- `actor` field (person, company, product, property, institution)
- `claim` field (plain-language statement)
- `evidence` array with typed artifacts (document, dataset, certification, permit, inspection, audio, video, source_file)
- `external_verification` array — links to `.gov` and third-party public records that create **Deterministic Collisions** if a provided artifact conflicts with the public record
- `integrity` block — who signed the manifest, when, and where the `.asc` file lives

### The `/.well-known/claims.json` Standard
Any actor — a plumber, a nonprofit, a property, a product — can host a standardized discovery endpoint at `/.well-known/claims.json`. This is how the standard spreads: not through mandates, but through adoption.

### Domain Applications
See [USE_CASES.md](./USE_CASES.md) for full detail on:
- Trades & Local Services ("Joe the Plumber")
- Consumer Products ("The Kitchen Sink")
- Real Estate & Fractional Investment
- Civic & Political Accountability ("The People's Audit")
- Nonprofits & Organizational Transparency
- Creative Professionals (audio, visual, video)

### The Deterministic Collision
When `external_verification` links point to `.gov` records, the protocol can detect fabricated evidence automatically. If a provided PDF doesn't match the public congressional record or licensing database, the Handshake fails. No editorial judgment required — it's the math.

> *"The Kerekes Handshake does not replace journalism. It enhances it by providing direct access to primary artifacts."*

---

*Created by Jeffrey Kerekes | Systems Practitioner | jeffreykerekes.com*
