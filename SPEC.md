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
Map each claim to its evidence files. Use the [Resume Schema](./kerekes_handshake_v1_schema.json) or the [Universal Claims Schema](./kerekes_universal_claims_schema.json) depending on your use case. Set `verification_strength` honestly (see Section 11).

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
- [ ] Verification Strength: Every claim declares `verification_strength` (see Section 11)

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

### The Universal Schema
The [kerekes_universal_claims_schema.json](./kerekes_universal_claims_schema.json) extends the resume schema to support any domain. See Section 11 for the `verification_strength` field — the most important addition in v1.6.

### The `/.well-known/claims.json` Standard
Any actor — a plumber, a nonprofit, a property, a product — can host a standardized discovery endpoint at `/.well-known/claims.json`. This is how real standards spread: not through mandates, but through adoption.

### The Deterministic Collision
When `external_verification` links point to `.gov` records or live public endpoints, the protocol can detect fabricated evidence. If a provided PDF conflicts with the public congressional record or licensing database, the Handshake fails automatically. No editorial judgment required — it's the math.

> *"The Kerekes Handshake does not replace journalism. It enhances it by providing direct access to primary artifacts."*

---

## 11. Verification Strength — The Honest Layer

### The Red Team Problem: Self-Certification Is Self-Lying

**This protocol does not prevent fraud. Say that again: it does not prevent fraud.**

A motivated actor can fabricate a PDF, PGP-sign it, and serve it with perfect CORS headers. The signature proves *who vouched for the file and when* — it does not prove the underlying document is authentic. Anyone sophisticated enough to keyword-stuff a resume is sophisticated enough to forge a permit scan.

This is not a new problem. Humans have been lying in professional contexts for as long as professional contexts have existed. The apostille system — the international chain of document certification used to legalize records across borders — took **centuries to develop** precisely because people always lied and always will. That chain works by adding independent vouchers at each step: the notary, the state official, the federal authority, the consulate. No single actor controls the whole chain.

The Kerekes Handshake does not replicate the apostille chain. It does not require it. What it does is **raise the cost and detectability of lying** by anchoring claims to inspectable artifacts. It improves signal over noise. That is a meaningful contribution — not a solved problem.

### The Verification Strength Spectrum

Not all Handshake implementations are equal. Evidence quality exists on a spectrum from self-certified to government-verified:

| Strength | Type | Example | Forgery Difficulty |
|---|---|---|---|
| 1–2 | Self-authored document | "I saved $3.4M" Word doc | Trivial |
| 3–4 | Third-party authored, unlinked | Press article (no live endpoint) | Moderate |
| 5–6 | Third-party corroborated | Press article + `external_verification` link | Hard |
| 7–8 | Government record | FOI ruling, permit, inspection report | Very hard |
| 9 | Live government endpoint | License board lookup, congressional record | Near-impossible to fake |
| 10 | Live QR-verified vital record | Italy-style embedded verification (QR in document links to issuer) | Impossible without state collusion |

Italy's vital records system — embedding a QR code in the document that links directly to the issuing authority's verification endpoint — represents the current ceiling of document verification. The Handshake's `external_verification` field is the path toward that ceiling.

### The `verification_strength` Field

Every claim in v1.6 **SHOULD** declare its verification strength using two mechanisms:

**1. Self-declaration** (required): The actor declares the strength honestly in `claims.json`:

```json
"verification_strength": {
  "self_declared": 7,
  "rationale": "Municipal permit linked to live county building department lookup"
}
```

**2. AI assessment** (recommended): The auditing AI independently rates the strength on a 1–10 Likert scale based on the evidence quality it observes. There is room for subjectivity — a scale captures this better than a binary pass/fail:

```json
"verification_strength": {
  "self_declared": 7,
  "rationale": "Municipal permit linked to live county building department lookup",
  "ai_assessed": null,
  "ai_rationale": null
}
```

The AI fills in `ai_assessed` and `ai_rationale` during the audit. A gap between `self_declared` and `ai_assessed` is itself a signal.

### What the Protocol Actually Guarantees

| The protocol DOES | The protocol DOES NOT |
|---|---|
| Prove who vouched for the evidence | Prove the evidence is authentic |
| Make fabrication more expensive | Prevent fabrication |
| Surface conflicts with public records | Guarantee all records are checked |
| Raise the cost of lying | Eliminate lying |
| Improve signal over noise | Eliminate noise |

The honest claim: **The Kerekes Handshake moves professional verification from pure narrative to artifact-anchored evidence. It is a significant improvement over the status quo. It is not a solved problem.**

---

*Created by Jeffrey Kerekes | Systems Practitioner | jeffreykerekes.com*
