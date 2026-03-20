# Kerekes Handshake™ v1.6
**A universal protocol for anchoring any claim to primary evidence — auditable by humans and AI.**

> *Everyone is racing to put property deeds on the blockchain — but who is putting the new roof receipt in claims.json?*

---

## The Honest Position First

**Self-certification is self-lying.** This protocol does not prevent fraud. A motivated actor can fabricate evidence and sign it with PGP. The signature proves who vouched for the file — not that the file is authentic.

Humans have been lying in professional contexts forever. The apostille system — the international chain used to legalize documents across borders — took centuries to develop precisely because people always lied and always will. The Kerekes Handshake does not replicate that chain. What it does is **raise the cost and detectability of lying** by anchoring claims to inspectable artifacts and linking them to independent public records where they exist.

The goal is not a solved problem. The goal is a better signal-to-noise ratio than the current system, which has essentially none.

*That is a meaningful contribution. It is not a guarantee.*

**On legal posture:** By PGP-signing a manifest that links claims to evidence, the actor creates a cryptographically timestamped record of deliberate representation. This is structurally distinct from standard resume puffery. Knowingly including fabricated artifacts in a signed vault may constitute fraud in most jurisdictions — transforming a marketing claim into something closer to a commercial representation and warranty. This is not legal advice — consult an attorney for jurisdiction-specific guidance. See [LEGAL.md](./LEGAL.md).

---

## The Problem

AI has made everyone a "keyword genius." When every resume, product description, and political bio is perfectly optimized, the signal-to-noise ratio drops to zero. A "Perfect 10/10" resume can be generated for anyone in seconds.

**The Handshake ignores keywords. It audits provenance.**

---

## What It Is

A lightweight, open protocol that anchors any claim to a forensic vault of primary artifacts — making it auditable by humans and AI agents.

```
Actor → Claim → Artifact Vault → Verification
```

The same protocol that verifies a resume also verifies a plumber's license, a property's condition history, a nonprofit's financials, or a politician's 30-year voting record.

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

### Verification Strength
Every claim now declares — and AI independently assesses — how verifiable it actually is on a 1–10 scale:

| Score | Type | Example |
|---|---|---|
| 1–2 | Self-authored only | "I saved $3.4M" Word doc |
| 3–4 | Third-party, no live endpoint | Press article (PDF only) |
| 5–6 | Third-party with external link | Press article + `.gov` URL |
| 7–8 | Government record | FOI ruling, building permit |
| 9 | Live government endpoint | License board lookup |
| 10 | Live QR-verified vital record | Italy-style issuer verification |

A gap between the self-declared score and the AI-assessed score is itself a signal worth reporting.

---

## Use Cases

| Actor | Claim | The Vault | Strength |
|---|---|---|---|
| Job candidate | "Saved the city $3.4M" | Budget spreadsheets, FOI rulings | 7–9 |
| Joe the Plumber | "Licensed for gas lines" | Permits, insurance, inspection photos | 5–9 |
| LG Dishwasher | "Cleans 30% better" | Lab data, Energy Star ratings | 6–8 |
| Real estate | "New roof (2022)" | Paid invoice, permit, inspection | 7–9 |
| Nonprofit | "90% to the field" | PGP-signed audits, IRS 990 | 7–9 |
| Politician | "Voted for the environment" | 30-year roll-call + congress.gov | 9 |

Full detail: [USE_CASES.md](./USE_CASES.md)

---

## Two Ways to Implement

### Path A — Build It Yourself
- [SPEC.md](./SPEC.md) — Protocol overview, honest limits, and Vault Resume standard
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — Full technical reference
- [USE_CASES.md](./USE_CASES.md) — Domain applications with honest verification strength assessments
- [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md) — 5-minute deployment

### Path B — Let Claude Build It For You
No coding required. Upload your resume (or any evidence set) and paste one prompt.

→ **[CLAUDE_QUICKSTART.md](./CLAUDE_QUICKSTART.md)**

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
