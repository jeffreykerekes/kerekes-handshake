# Kerekes Handshake™ v1.6
**A universal protocol for moving any domain from Probabilistic Trust to Deterministic Verification.**

> *Everyone is racing to put property deeds on the blockchain — but who is putting the new roof receipt in claims.json?*
> *This protocol makes claims auditable, not automatically verified. A PGP signature proves who vouched for the evidence — not that the underlying document is authentic. The auditor still makes the final judgment.*
---

## The Problem

AI has made everyone a "keyword genius." When every resume, product description, and political bio is perfectly optimized, the signal-to-noise ratio drops to zero. Traditional trust systems — star ratings, editorial summaries, brochures, press releases — are all probabilistic. They ask you to guess.

**The Kerekes Handshake ignores keywords. It audits provenance.**

---

## What It Is

A lightweight, open protocol that anchors any claim to a forensic vault of primary artifacts, making it auditable by humans and AI agents.

The universal circuit:

```
Actor → Claim → Artifact Vault → Verification
```

The same protocol that verifies a resume also verifies a plumber's license, a nonprofit's financials, a property's condition history, or a politician's 30-year voting record.

---

## The Three-Layer Stack

1. **Narrative Layer:** The human-readable summary — tagged with `data-kcm` anchors.
2. **Registry Layer:** `claims.json` — maps each claim ID to evidence URIs.
3. **Integrity Layer:** `site_manifest.json.asc` — PGP-signed SHA-256 manifest. The Root of Trust.

---

## v1.6: Two Innovations

### The Vault Resume
Stop explaining your work in prose. Put the wins on a dense half-page. Let AI pull the vault.

```
HUMAN LAYER (half-page):   Dense stubs → six-second scan → "worth a query"
                                         ↓
AI LAYER (infinite vault):  Fetch evidence → verify claims → return verdict
```

See [SPEC.md Section 9](./SPEC.md) for the full Vault Resume standard.

### Universal Claims
The same architecture applies to any actor making any claim. See [USE_CASES.md](./USE_CASES.md) for the full range of applications — from Joe the Plumber to fractional real estate to civic accountability.

The generic schema: [kerekes_universal_claims_schema.json](./kerekes_universal_claims_schema.json)

---

## Use Cases

| Actor | Claim | The Vault |
|---|---|---|
| **Job candidate** | "Saved the city $3.4M" | Budget spreadsheets, FOI rulings, press coverage |
| **Joe the Plumber** | "Licensed for gas lines" | Permits, insurance certs, inspection photos |
| **LG Dishwasher** | "Cleans 30% better" | Lab data, Energy Star ratings, service manual |
| **Real estate listing** | "New roof (2022)" | Paid invoice, permit, inspection sign-off |
| **Nonprofit** | "90% to the field" | PGP-signed audits, ledger snapshots |
| **Politician** | "Voted for the environment" | 30-year roll-call history, donation records |

Full detail: [USE_CASES.md](./USE_CASES.md)

---

## Two Ways to Implement

### Path A — Build It Yourself
- [SPEC.md](./SPEC.md) — Protocol overview and Vault Resume standard
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — Full technical reference
- [USE_CASES.md](./USE_CASES.md) — Domain-specific applications
- [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md) — 5-minute deployment

### Path B — Let Claude Build It For You
No coding required. Upload your resume (or any evidence set) to Claude and paste one prompt.

→ **[CLAUDE_QUICKSTART.md](./CLAUDE_QUICKSTART.md)**

---

## Sample Audit Queries

* *"Verify all claims on this resume. Flag anything unsupported."*
* *"Interview the van: is this plumber's license current and has their work passed inspection?"*
* *"Audit this politician's 30-year environmental record against their donor history."*
* *"Verify the property condition claims before I wire a fractional share payment."*

---

## AI Compatibility (March 2026)

| Agent | Status | Notes |
|---|---|---|
| **Grok (X.ai)** | ✓ Fully Compatible | Best-in-class for live forensic crawls |
| **ChatGPT / Claude / Perplexity** | ✓ Compatible | Use Text Bridge `.txt` files; enable CORS |

---

## Identity Verification

- **PGP Fingerprint:** `D39E 4ACE A4FE 3E6B 547F 58C4 6174 3446 DFA7 D48F`
- **Signed Summary:** [jeffreykerekes.com/verify/summary.txt](https://jeffreykerekes.com/verify/summary.txt)
- **Public Key:** [verify/pubkey.txt](./verify/pubkey.txt)

---

## License (CC BY-SA 4.0)

Free to use, remix, and build on. Credit Jeffrey Kerekes. Keep derivatives open. No proprietary walled gardens.

---

**Created by Jeffrey Kerekes — Systems Practitioner**
[Live Demo](https://jeffreykerekes.com) | [Protocol Spec](./SPEC.md) | [Whitepaper](./Kerekes-Handshake-Whitepaper-Spec-V1.6.pdf) | [Use Cases](./USE_CASES.md)
