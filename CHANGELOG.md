# Changelog — Kerekes Handshake™

## v1.6 (March 2026)

### Universal Claims Expansion
- **Added:** Universal Claims Standard — the protocol now applies to any actor making any verifiable claim, not just professional resumes
- **Added:** `kerekes_universal_claims_schema.json` — generic schema supporting person, company, product, property, and institution actors
- **Added:** `actor`, `claim`, `external_verification`, and typed `evidence` fields to the universal schema
- **Added:** `external_verification` field enabling **Deterministic Collisions** — AI-detectable fabrication via `.gov` and third-party public record links
- **Added:** `/.well-known/claims.json` as the recommended universal discovery endpoint
- **Added:** `USE_CASES.md` — full domain-specific application guide (trades, consumer goods, real estate, civic/political, nonprofits, creative)

### Vault Resume
- **Added:** Vault Resume — Presentation Layer Standard for the Narrative Layer
- **Added:** Dense-stub format specification with `REF:` claim anchors
- **Added:** Two-layer model: human (half-page scan) + AI (infinite vault)
- **Added:** v1.6 compliance checklist (superset of v1.5)

### Note on Versioning
v1.6 is additive only. All v1.5 infrastructure (Text Bridge, PGP manifest, KCM markup, CORS) is unchanged. The universal claims schema is backward-compatible with the resume schema. Upgrading from v1.5 requires no infrastructure changes.

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
