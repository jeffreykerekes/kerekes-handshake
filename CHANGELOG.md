# Changelog — Kerekes Handshake™

## v1.5 (March 2026)

- **Added:** Text Bridge requirement — every PDF artifact must have a matching `.txt` sidecar to enable zero-hallucination AI extraction
- **Added:** `site_manifest.json.asc` — PGP-signed SHA-256 manifest as cryptographic Root of Trust (replaces signing `claims.json` directly)
- **Added:** `IMPLEMENTATION.md` — dedicated technical implementation guide
- **Added:** `KCM_SPEC.md` — standalone KCM attribute reference
- **Added:** `CLAUDE_QUICKSTART.md` — Path B: build a compliant site in one Claude session
- **Updated:** Three-layer model — Integrity Layer (PGP seal) replaces generic "Verification Layer"
- **Updated:** Compliance checklist expanded from 5 to 6 criteria
- **Updated:** `claims.json` now includes `integrity_manifest` field and PGP `proof` block
- **Fixed:** Version fragmentation resolved — all documents reference v1.5

## v1.0 (Initial Release)

- Core protocol: `claims.json` + KCM markup + `/evidence/` vault
- Basic two-layer model: Narrative + Registry
- OpenAPI spec, `ai-plugin.json` discovery, CORS via `_worker.js`
- CC BY-SA 4.0 license
- Reference implementation: jeffreykerekes.com
