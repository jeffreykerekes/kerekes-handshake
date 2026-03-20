# Changelog — Kerekes Handshake™

## v1.6 (March 2026)

### Universal Claims Expansion
- **Added:** Universal Claims Standard — the protocol applies to any actor making any verifiable claim
- **Added:** `kerekes_universal_claims_schema.json` — generic schema supporting person, company, product, property, and institution actors
- **Added:** `USE_CASES.md` — domain-specific application guide with honest verification strength assessments per use case
- **Added:** `external_verification` field — links to `.gov` and third-party public records enabling Deterministic Collisions when fabricated evidence conflicts with public records
- **Added:** `/.well-known/claims.json` as the recommended universal discovery endpoint

### Verification Strength (New in v1.6)
- **Added:** `verification_strength` field in `claims.json` — every claim now declares and AI auditors independently assess verification strength on a 1–10 Likert scale
- **Added:** `self_declared` score with `rationale` — honest self-assessment by the actor
- **Added:** `ai_assessed` score with `ai_rationale` — independent AI assessment; gap between self-declared and AI-assessed is a signal
- **Added:** Verification strength spectrum from self-authored document (1–2) to Italy-style live QR-verified vital records (10)
- **Added:** `endpoint_type` field on `external_verification` entries distinguishing static pages from live lookup endpoints

### Honest Framing (Red Team)
- **Added:** "Self-Certification Is Self-Lying" section in SPEC.md — direct acknowledgment that the protocol does not prevent fraud
- **Added:** Historical context: the apostille system took centuries to develop because people always lied and always will
- **Added:** Per-use-case honest limits in USE_CASES.md — what can and cannot be independently confirmed for each domain
- **Updated:** "Deterministic Verification" language softened to "Evidence-Based Verification" throughout — more accurate
- **Updated:** README opens with honest position before benefits
- **Added:** Table of what the protocol does and does not guarantee

### Vault Resume
- **Added:** Vault Resume — Presentation Layer Standard for the Narrative Layer
- **Added:** Dense-stub format with `REF:` claim anchors
- **Added:** Two-layer model: human half-page + AI infinite vault

### Note on Versioning
v1.6 is additive only. All v1.5 infrastructure (Text Bridge, PGP manifest, KCM markup, CORS) is unchanged. Upgrading from v1.5 requires no infrastructure changes. The `verification_strength` field is new and required in v1.6 compliance.

---

## v1.5 (March 2026)

- **Added:** Text Bridge — every PDF artifact must have a matching `.txt` sidecar for zero-hallucination AI extraction
- **Added:** `site_manifest.json.asc` — PGP-signed SHA-256 manifest as cryptographic Root of Trust
- **Added:** `IMPLEMENTATION.md` — dedicated technical guide
- **Added:** `KCM_SPEC.md` — standalone KCM attribute reference
- **Added:** `CLAUDE_QUICKSTART.md` — Path B: build a compliant site in one Claude session
- **Updated:** Three-layer model — Integrity Layer replaces generic "Verification Layer"
- **Updated:** Compliance checklist expanded to 6 criteria

---

## v1.0 (Initial Release)

- Core protocol: `claims.json` + KCM markup + `/evidence/` vault
- Basic two-layer model: Narrative + Registry
- OpenAPI spec, `ai-plugin.json` discovery, CORS via `_worker.js`
- CC BY-SA 4.0 license
- Reference implementation: jeffreykerekes.com
