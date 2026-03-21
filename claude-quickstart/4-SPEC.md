# Kerekes Handshake Specification v1.6
**A self-certifying evidence framework for claims that no third party will certify.**

> *For the full whitepaper, see [Kerekes-Handshake-Whitepaper-Spec.pdf](./Kerekes-Handshake-Whitepaper-Spec.pdf). For technical implementation detail, see [IMPLEMENTATION.md](./IMPLEMENTATION.md). For domain-specific applications, see [USE_CASES.md](./USE_CASES.md).*

---

## 0. Abstract

The **Kerekes Handshake** is an evidence-anchoring framework designed to move professional and organizational claims from pure assertion toward inspectable, artifact-backed representation.

**Traditional trust:** Claim → Narrative → Guess
**Kerekes Handshake:** Claim → Evidence → Verification
**Vault Resume (v1.6):** Claim stub → AI audit → Evidence vault → Verdict

The framework is **domain-agnostic**. The same architecture that verifies a resume verifies a plumber's license, a property's condition history, or a politician's voting record — anywhere primary artifacts exist.

```
Actor → Claim → Artifact Vault → Verification
```

---

## 1. The Three-Layer Stack

A compliant implementation must exist across three distinct layers:

1. **The Narrative Layer (HTML/PDF):** The human-readable summary. Claims are tagged with `data-kcm` attributes.
2. **The Registry Layer (JSON):** The `claims.json` ledger — maps each claim ID to specific evidence URIs.
3. **The Integrity Layer (PGP):** The `site_manifest.json.asc` — a PGP-signed manifest containing SHA-256 hashes of all artifacts. The cryptographic Root of Trust.

---

## 2. The Text Bridge (AI Extraction)
*Born from real-world debugging, March 2026.*

Most AI crawlers fail to reliably parse binary PDF streams in real-time — stalling, skipping, or hallucinating content. The Text Bridge solves this: for every PDF in `/evidence/`, a matching `.txt` sidecar **must** be present.

AI agents fall back to the `.txt` sidecar if the PDF is unreadable. This ensures accurate extraction without hallucination.

```bash
for f in *.pdf; do pdftotext "$f" "${f%.pdf}.txt"; done
```

---

## 3. KCM (Kerekes Claim Markup)

The semantic bridge between narrative and evidence.

**Attribute:** `data-kcm="unique_claim_id"`
**Placement:** On the parent `<article>` or `<section>` container of a claim.
**Mapping:** Must correspond to a key in `claims.json`.

```html
<article data-kcm="budget_audit_2011">
  <h3>Municipal Budget Reconstruction</h3>
  <p>Exposed $38k per-household debt liability via manual audit.</p>
  <ul class="evidence">
    <li><a href="/evidence/audit.pdf">Audit Spreadsheet</a></li>
  </ul>
</article>
```

### The KCM-CLAIMS Comment (AI Token Mitigation)

AI agents operating under token conservation constraints sometimes parse only visible page text rather than reading full HTML source. This causes `data-kcm` attributes — which are invisible to a text-only parser — to be missed entirely.

Mitigation: every compliant Narrative Layer page must include this HTML comment immediately after the `<body>` tag:

```html
<!-- KCM-CLAIMS: claim_id_1 | claim_id_2 | claim_id_3 -->
```

This comment is readable as plain text even when attribute parsing fails. It is a pragmatic workaround for a real limitation of current AI crawlers. It will remain necessary until AI agents consistently parse raw HTML source rather than rendered text.

---

## 4. Cryptographic Identity Binding

The evidence vault is bound to the steward's identity via PGP.

- **Verify:** `$ curl -s [domain]/site_manifest.json.asc | gpg --verify`
- **Re-sign after any change:** `$ gpg --clearsign site_manifest.json`

---

## 5. Quick Start (5 Steps)

**Step 1 — Collect evidence**
Gather primary-source documents that verify your claims.

**Step 2 — Generate the Text Bridge**
For each PDF, create a matching `.txt` sidecar. Run the bash command in Section 2.

**Step 3 — Build `claims.json`**
Map each claim to its evidence files. Set `verification_strength` honestly (see Section 11).

**Step 4 — Tag your HTML**
Wrap each claim in `<article data-kcm="your_claim_id">`. Add the KCM-CLAIMS comment.

**Step 5 — Deploy**
Static hosting works: GitHub Pages, Netlify, Cloudflare Pages. Enable CORS for `/evidence/`.

---

## 6. Implementation Requirements

**v1.5 Compliant:**
- [ ] KCM Markup: HTML uses `data-kcm` on all claim containers
- [ ] KCM-CLAIMS comment present in `<body>`
- [ ] Registry: `claims.json` maps every claim ID to at least one evidence URI
- [ ] Text Bridge: 100% of PDFs have a matching `.txt` sidecar
- [ ] Integrity Seal: `site_manifest.json.asc` is PGP-signed and current
- [ ] Open Access: CORS headers enabled for `/evidence/`

**v1.6 Compliant** (superset of v1.5):
- [ ] All v1.5 requirements above
- [ ] Vault Resume Format: Narrative Layer uses dense-stub presentation (see Section 9)
- [ ] Verification Strength: Every claim declares `verification_strength.self_declared` with honest rationale (see Section 11)
- [ ] External Verification: High-stakes claims include `external_verification` links where public records exist

---

## 7. Technical Infrastructure

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for `openapi.yaml`, `_worker.js`, `ai-plugin.json`, and `llms-full.txt`.

---

## 8. License (CC BY-SA 4.0)

Free public utility. Attribute Jeffrey Kerekes. Derivatives must use the same license. No walled gardens.

---

## 9. The Vault Resume — Presentation Layer Standard (v1.6)

### Philosophy
Recruiters scan in six seconds. AI agents can audit in sixty. Stop trying to serve both with the same prose. Separate them.

```
HUMAN LAYER (half-page):   Dense stubs → six-second scan → "worth a query"
                                         ↓
AI LAYER (infinite vault):  Fetch evidence → verify claims → return verdict
```

### Stub Format
```
[Domain]: [role/intervention], [key metric], [date range] — REF: [claim_id]
```

Example:
```
Civic: Municipal budget audit, $38k/household debt exposed, FIC 2009-014 secured, 2007–2011 — REF: budget_audit_2007_2011
```

### Rules
- One line per claim — no prose
- Lead with the metric or outcome
- Always end with `REF: [claim_id]`
- No adjectives — the evidence qualifies the claim

---

## 10. Multi-Domain Claims Standard (v1.6)

The framework applies to any actor making any verifiable claim. The universal circuit:

```
Actor → Claim → Artifact Vault → Verification
```

The [kerekes_universal_claims_schema.json](./kerekes_universal_claims_schema.json) extends the resume schema to support person, company, product, property, and institution actors.

### The `/.well-known/claims.json` Endpoint
Any actor can host a standardized discovery endpoint at `/.well-known/claims.json`. This is how conventions spread — not through mandates, but through adoption.

### The Deterministic Collision
When `external_verification` links point to live `.gov` records, fabricated evidence becomes self-defeating. If a provided PDF conflicts with the public record, the verification fails automatically.

> *"This framework does not replace journalism. It provides direct access to primary artifacts."*

---

## 11. Verification Strength — The Honest Layer

### Self-Certification Is Self-Lying

**This framework does not prevent fraud.**

A motivated actor can fabricate a PDF, sign it with PGP, and serve it with a perfect evidence vault. The signature proves who vouched for the file and when — not that the underlying document is authentic. Anyone sophisticated enough to keyword-stuff a resume is sophisticated enough to forge a permit scan.

Humans have been lying in professional contexts forever. The apostille system took centuries to develop because people always lied and always will. This framework does something more modest: it raises the cost and detectability of lying. That is a meaningful improvement. It is not a guarantee.

### The Verification Strength Spectrum

| Strength | Type | Example | Forgery Difficulty |
|---|---|---|---|
| 1–2 | Self-authored, unlinked | "I saved $3.4M" Word doc | Trivial |
| 3–4 | Third-party authored, no live endpoint | Press article (PDF only) | Moderate |
| 5–6 | Third-party + `external_verification` link | Press article + `.gov` URL | Hard |
| 7–8 | Government record with public lookup | FOI ruling, building permit | Very hard |
| 9 | Live government endpoint | License board lookup | Near-impossible |
| 10 | Live QR-verified vital record | Italy-style embedded verification | Impossible without state collusion |

### The `verification_strength` Field

Every claim in v1.6 declares:

```json
"verification_strength": {
  "self_declared": 7,
  "rationale": "Municipal permit linked to live county building department lookup.",
  "ai_assessed": null,
  "ai_rationale": null
}
```

The actor self-declares. The AI independently assesses the same scale. A gap between the two is a signal.

### What This Framework Guarantees and Does Not

| Does | Does Not |
|---|---|
| Prove who vouched for the evidence | Prove the evidence is authentic |
| Make fabrication more expensive | Prevent fabrication |
| Surface conflicts with public records | Guarantee all records are checked |
| Raise the cost of lying | Eliminate lying |
| Improve signal over noise | Eliminate noise |

---

## 12. Known AI Limitations

These limitations were discovered through real deployment and audit testing, not theory.

**Token conservation:** AI agents under context pressure parse visible text rather than raw HTML, missing `data-kcm` attributes entirely. The KCM-CLAIMS HTML comment (Section 3) is the current mitigation.

**PDF binary blindness:** Most AI crawlers fail on binary PDFs in real-time. The Text Bridge (Section 2) is the mitigation.

**Variable crawl budgets:** Consumer-tier free AI agents have lower token and crawl budgets than enterprise deployments. Verification quality scales with the agent's available budget. HR departments and enterprise users running dedicated AI workflows will get more complete audits than someone on a free plan.

**Evolving AI capabilities:** New model releases change what agents can and cannot parse. This framework's mitigations may need updating as AI capabilities change. Verification is an ongoing problem, not a solved one.

---

## 13. Future Direction — W3C Verifiable Credentials

The W3C Verifiable Credentials standard and DID (Decentralized Identifier) infrastructure will eventually cover many credential types institutionally. The SHA-256 hashes in this framework's manifest are already in a compatible format for VC export.

A proposed v2.0 addition: optional `did` and `vc_export` fields in `claims.json`, allowing any Handshake vault to be promoted to a full VC when an issuer relationship becomes available. The two approaches are complementary — this framework handles self-sovereign, non-credentialed accomplishments that institutional VC infrastructure will not certify. The framework and VC standards are bridges to the same destination from different starting points.

---

*Created by Jeffrey Kerekes | Systems Practitioner | jeffreykerekes.com*
