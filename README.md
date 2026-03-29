# Kerekes Handshake (TM) v1.6

![Kerekes Handshake — AI Resume Fraud](https://github.com/jeffreykerekes/kerekes-handshake/blob/main/ai-resume-fraud.jpg)

**A self-certifying evidence framework for claims that no third party will ever certify.**

> *Everyone is racing to put property deeds on the blockchain — but who is putting the new roof receipt in claims.json?*

---

## The Honest Position First

**Self-certification is self-lying.** This framework does not prevent fraud. A motivated actor can fabricate evidence and sign it with PGP. The signature proves who vouched for the file — not that the file is authentic.

Humans have been lying in professional contexts forever. The apostille system — the international chain used to legalize documents across borders — took centuries to develop precisely because people always lied and always will. The Kerekes Handshake does not replicate that chain. What it does is **raise the cost and detectability of lying** by anchoring claims to inspectable artifacts and linking them to independent public records where they exist.

The goal is not a solved problem. The goal is a better signal-to-noise ratio than the current system, which has essentially none.

*That is a meaningful contribution. It is not a guarantee.*

**On legal posture:** By PGP-signing a manifest that links claims to evidence, the actor creates a cryptographically timestamped record of deliberate representation. This is structurally distinct from standard resume puffery. Knowingly including fabricated artifacts in a signed vault may constitute fraud in most jurisdictions — transforming a marketing claim into something closer to a commercial representation and warranty. This is not legal advice — consult an attorney for jurisdiction-specific guidance. See [LEGAL.md](./LEGAL.md).

---

## The Problem

AI has made everyone a "keyword genius." When every resume, product description, and political bio is perfectly optimized, the signal-to-noise ratio drops to zero. A perfect resume can be generated for anyone in seconds.

**This framework ignores keywords. It audits provenance.**

---

## What It Is

A lightweight, open framework that anchors any claim to a primary artifact vault — making it auditable by humans and AI agents.

```
Actor → Claim → Artifact Vault → Verification
```

Started as a resume tool. Generalized to any domain where a claim needs evidence: trades licensing, property condition history, nonprofit financials, political voting records. The three-layer structure works for all of them.

---

## The Three-Layer Stack

1. **Narrative Layer:** The human-readable summary — tagged with `data-kcm` anchors.
2. **Registry Layer:** `claims.json` — maps each claim ID to evidence URIs.
3. **Integrity Layer:** `site_manifest.json.asc` — PGP-signed SHA-256 manifest. The Root of Trust.

---

## v1.6 Additions

### The Vault Resume
A dense half-page for human recruiters. An infinite evidence vault for AI agents. Neither compromises the other.

```
HUMAN LAYER (half-page):   Dense stubs → six-second scan → "worth a query"
                                         ↓
AI LAYER (infinite vault):  Fetch evidence → verify claims → return verdict
```

### Verification Strength
Every claim declares — and AI independently assesses — how verifiable it actually is on a 1–10 scale:

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

## Known AI Limitations

AI verification is an ongoing cat-and-mouse problem. These are the known failure modes as of March 2026:

**Token conservation:** AI agents with limited context windows will sometimes read only the visible text of a page rather than parsing raw HTML attributes. The `data-kcm` attributes in KCM markup are invisible to a text-only parser. Mitigation: every compliant page includes a `<!-- KCM-CLAIMS: id1 | id2 | ... -->` HTML comment near the top of `<body>`. This is readable as plain text even when attribute parsing fails.

**PDF binary blindness:** Most AI crawlers fail to reliably parse binary PDF streams in real-time, producing hallucinated or missing content. Mitigation: the Text Bridge — every PDF has a matching `.txt` sidecar with identical filename. AI agents fall back to the sidecar automatically.

**CORS and crawl limits:** Not all AI agents respect CORS headers or follow every evidence link. Enterprise AI deployments with dedicated browsing budgets perform significantly better than consumer-tier free options. Verification quality scales with the AI agent's token and crawl budget.

**The standard will keep evolving.** New AI capabilities will surface new gaps; new mitigations will follow. This framework will need to track those changes. Version history is in [CHANGELOG.md](./CHANGELOG.md).

---

## One-Click Validator

A browser-based integrity checker is available at [/kerekes-handshake/validator.html](./validator.html).

It fetches the `site_manifest.json.asc` for any compliant domain, re-computes SHA-256 hashes of listed files, and returns green/red status per file — no server required, no special tools. This turns "trust the process" into "watch it work."

---

## Two Ways to Implement

### Path A — Build It Yourself
- [SPEC.md](./SPEC.md) — Framework overview, honest limits, Vault Resume standard
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — Full technical reference
- [USE_CASES.md](./USE_CASES.md) — Domain applications with honest verification strength assessments
- [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md) — 5-minute deployment

### Path B — Let Claude Build It For You
No coding required. Upload your resume (or any evidence set) and paste one prompt.

→ **[CLAUDE_QUICKSTART.md](./CLAUDE_QUICKSTART.md)**

---

## Sample Audit Reports

Real audit runs on the reference implementation are in [/reference-implementation/audit-reports/](./reference-implementation/audit-reports/). These include both clean verifications and documented failures — token conservation issues, partial parses, and the KCM-CLAIMS comment workaround in action.

| Report | Verdict | Notes |
|---|---|---|
| [grok_report-1.pdf](./reference-implementation/audit-reports/grok_report-1.pdf) | Pre-deployment | KCM markup absent — shows what failure looks like |
| [grok_report-2.pdf](./reference-implementation/audit-reports/grok_report-2.pdf) | Partial | Manifest not discoverable; claims verified via archive index only |
| [grok_report-3.pdf](./reference-implementation/audit-reports/grok_report-3.pdf) | Supported | Full audit — integrity confirmed, Recruiter Note positive |
| [grok_report-4.pdf](./reference-implementation/audit-reports/grok_report-4.pdf) | Supported | KCM REF tags resolved by claim_id, claims.json mapped |
| [Validator run 1](./reference-implementation/audit-reports/Kerekes%20Handshake%20—%20Vault%20Integrity%20Validator-01.pdf) | 402/404 | Two expected index.html FAILs (now excluded by design) |
| [Validator run 2](./reference-implementation/audit-reports/Kerekes%20Handshake%20—%20Vault%20Integrity%20Validator-02.pdf) | 402/402 | All files verified after index.html exclusion fix |

---

## Future Direction: W3C Verifiable Credentials

The W3C Verifiable Credentials standard and DID (Decentralized Identifier) infrastructure will eventually provide institutional verification for many credential types. The SHA-256 hashes in the Kerekes Handshake manifest are already in a compatible format for VC export. A future v2.0 could add optional `did` and `vc_export` fields to `claims.json`, allowing any Handshake vault to be promoted to a full VC when an issuer relationship exists. The two approaches are complementary: this framework handles the self-sovereign, non-credentialed case that institutional VC infrastructure will not touch.

---

## AI Compatibility (March 2026)

| Agent | Status | Notes |
|---|---|---|
| **Grok (X.ai)** | ✓ Tested | Best crawl performance; handles Text Bridge natively |
| **ChatGPT / Claude / Perplexity** | ✓ Compatible | Text Bridge recommended; results vary by token budget |
| **Consumer free tiers** | ⚠ Variable | Token limits cause partial parsing; use KCM-CLAIMS comment mitigation |
| **Enterprise tiers** | ✓ Better | Larger context windows reduce token-conservation failures |

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
[Live Demo](https://jeffreykerekes.com) | [Framework Spec](./SPEC.md) | [Whitepaper](./Kerekes-Handshake-Whitepaper-Spec.pdf) | [Use Cases](./USE_CASES.md) | [Validator](./validator.html)
