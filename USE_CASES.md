# Kerekes Handshake™ — Use Cases & Applications

**From Verifiable Resumes to Deterministic Claims.**

---

## The Universal Model

The Kerekes Handshake™ is not a resume tool. It is a universal protocol for moving any domain from **Probabilistic Trust** (guessing based on narrative) to **Deterministic Verification** (auditing based on evidence).

Every application follows the same structural circuit:

```
Actor → Claim → Artifact Vault → Verification
```

- **Actor:** A person, company, product, or organization making a claim.
- **Claim:** The specific statement being asserted.
- **Artifact Vault:** The primary, raw evidence (PDFs, permits, data, logs, recordings).
- **Verification:** A human or AI agent auditing the vault directly.

The protocol is **domain-agnostic**. The same `claims.json` structure, Text Bridge, and PGP-signed manifest that verifies a resume also verifies a plumber's license, a nonprofit's financials, or a property's condition history.

---

## The Core Problem: The Keyword Genius Paradox

AI has made everyone a "keyword genius." When every resume, product description, and political bio is perfectly optimized with the right language, the signal-to-noise ratio drops to zero. A "Perfect 10/10" resume can be generated for anyone in seconds.

**The Handshake ignores keywords. It audits provenance.**

---

## Use Cases

### 1. Professional Credentials — "Interview the Resume"

**The Problem:** AI-generated narrative has made resumes indistinguishable. Keywords are cheap; proof is expensive. Traditional resumes force you to kill your best stories to fit a two-page limit.

**The Claim:** "Saved the city $3.4M via forensic budget reconstruction."

**The Vault:** Original budget spreadsheets, FOI rulings, council resolutions, press coverage.

**The Value:** Keep the resume to a clean one-page summary while an AI performs a zero-hallucination audit of 20 years of primary evidence. Cram in the kitchen sink — without the cram. The resume becomes a mirror reflecting the vault.

**Reference implementation:** [jeffreykerekes.com](https://jeffreykerekes.com)

---

### 2. Trades & Local Services — "Joe the Plumber"

**The Problem:** Customers rely on easily manipulated 5-star ratings. There is no way to verify that a tradesperson's insurance is current, their license is valid, or their past jobs actually passed inspection.

**The Claim:** "Certified for high-pressure gas lines and fully insured."

**The Vault:** Municipal permits, insurance certificates, time-stamped photos of past code-pass inspections.

**The Value:** A QR code on the service van links to a `/query` portal. An AI assistant can **"interview the van"** before the technician steps into your home — verifying active credentials, insurance status, and recent inspection history without a phone call or background check service.

> *Shift: From trusting a brand to verifying a system.*

---

### 3. Consumer Products — "The Kitchen Sink"

**The Problem:** Marketing compresses complex technical reality into simplified, unverifiable slogans. The 400-page service manual exists; the brochure ignores it.

**The Claim:** "New Dishwasher Model X cleans 30% more efficiently with SteamTech™."

**The Vault:** Laboratory test datasets, Energy Star raw ratings, unedited internal testing videos, the full service manual.

**The Value:** The manufacturer anchors the brochure to the vault. Marketing is separated from evidence. Consumers who want the kitchen sink get it; those who just want to buy a dishwasher see the clean summary. No cram.

> *Shift: From marketing genius to engineering reality.*

---

### 4. Real Estate & Property Transparency

**The Problem:** Everyone is racing to put property deeds on the blockchain — but ownership is already recorded. What's missing is verifiable *condition history*. Property listings focus on trusting the agent, not verifying the asset.

**The Claim:** "New roof (2022), updated HVAC, no outstanding permits."

**The Vault:** Roofing contracts, paid invoices, before/after photos, permit approvals, mechanical inspection reports, radon test results.

**The Value:** Each property acts as its own Actor with a `claims.json`. You don't buy the listing; you buy the vault. An investor in Mumbai can audit the roof receipt before wiring a fractional share payment.

> *"Everyone is racing to put property deeds on the blockchain — but who is putting the new roof receipt in claims.json?"*

**Fractional Real Estate Extension:** For developers selling fractional shares to global investors, the Handshake builds the trust infrastructure the offering requires. An AI agent can verify the rent roll, permit history, and maintenance records automatically — transforming speculative fractional assets into verifiable systems.

---

### 5. Civic & Political Accountability — "The People's Audit"

**The Problem:** Political narratives are shaped by press secretaries, selective voting summaries, and probabilistic attack ads. AI has made every press operation a "narrative genius."

**The Claim:** "A 30-year record of environmental protection."

**The Vault:** Complete roll-call voting history, original bill PDFs, donation ledgers, committee records — all PGP-signed.

**The Value:** Independent researchers build forensic dossiers without needing Super PAC budgets. A voter's AI can audit 30 years of legislative record to ask: "How many times did this politician vote for an environmental measure while simultaneously receiving donations from affected industries?" The AI doesn't guess — it audits the `claims.json`.

> *"The Kerekes Handshake does not replace journalism. It enhances it by providing direct access to primary artifacts."*

**The `external_verification` field** links directly to `.gov` records. If a provided PDF doesn't match the congressional record, the Handshake produces a **Deterministic Collision** — the lie surfaces automatically without editorial judgment.

---

### 6. Nonprofits & Organizational Transparency

**The Problem:** Donors give based on trust in a brand. Charity watchdogs provide subjective scores. Neither gives direct access to the underlying financials.

**The Claim:** "90% of donations go directly to the field."

**The Vault:** PGP-signed forensic audits, real-time ledger snapshots, grant disbursement records.

**The Value:** Donors and watchdogs can audit the claim directly. The nonprofit doesn't ask for trust — it provides proof. The PGP signature tells auditors exactly who vouched for each artifact and when.

---

### 7. Creative Professionals — "The Death of the Portfolio Hallucination"

**The Problem:** A design portfolio is a collection of pretty pictures that may have been produced by a team, a template, or a client's revisions. A YouTube highlight reel proves nothing about raw skill.

**The Claim:** "Expert in non-destructive editing and complex vector masking."

**The Vault:** The source `.psd` or `.ai` file — not the exported JPEG. The layer stack, named smart objects, and mask history are the evidence. A "keyword genius" can claim Photoshop expertise; only a Handshake-verified designer provides the `.psd` that proves they didn't flatten a stolen image.

**Extension — Audio:** For musicians and vocalists, the vault isn't a spreadsheet — it's a raw, unedited multitrack stem or dry vocal take (no auto-tune). A specialized Audio-LLM can verify pitch, timing, and technique directly from the `.wav` file, bypassing the highly produced YouTube video.

**Extension — Video:** For motion designers, the vault is the project file (`.aep`) and the raw plate footage. A video-analysis AI can verify keyframe complexity and motion-tracking depth without watching the whole reel.

---

## Core Concepts

### High-Fidelity Accountability
Moving from subjective 5-star ratings to objective 5-artifact proofs. The rating system is noise. The artifact is signal.

### Reduced Reliance on Intermediaries
There is no need to pay a third party to "verify" a professional when that professional can provide a PGP-signed chain of custody for their own credentials. The protocol shifts trust from opaque intermediaries to transparent, inspectable evidence.

### The Universal Evidence Endpoint
Every product, person, property, and project should host a standardized `/.well-known/claims.json` endpoint. This is how real standards spread — not through mandates, but through adoption.

### Interview the Record
AI systems can bypass narrative summaries and directly analyze the claims, supporting artifacts, and historical patterns. You don't interview the candidate — you **interview the record**.

### Deterministic Hiring (and Buying, and Voting)
Modern hiring, purchasing, and voting are probabilistic — based on guesses from optimized narratives. The Handshake makes them deterministic — the math (PGP/hashes) and the artifacts either support the claim or they don't. No ambiguity.

### The Ice Cream Float
You aren't building the PDF reader (ice cream) or the PGP library (soda). You are engineering the system that combines them into a verifiable signal. The ingredients are open; the architecture is the invention.

---

## The Integrity Layer — Defeating Malicious Insertion

As we enter the era of AI-generated fake evidence, the L3 Integrity Layer becomes critical.

The `site_manifest.json.asc` (PGP-signed SHA-256 manifest) tells the auditor:
- **Who** is vouching for each artifact
- **When** the vault was sealed
- **Whether** any file has been tampered with since signing

The `external_verification` field in `claims.json` links to third-party public records (`.gov` sites, court databases, regulatory filings). If a provided PDF doesn't match the public record, the Handshake fails automatically — a **Deterministic Collision** that no amount of narrative can override.

---

## The Consulting Opportunity

The protocol is open and free. The **implementation** is a professional service.

Many organizations have the evidence but not the architecture. They have the kitchen sink; they need the float. The Handshake consultant:

1. **Forensic Implementation** — Extracts existing evidence, builds the vault, produces a compliant `claims.json`, PGP-signed manifest, and query portal.
2. **Seal of Integrity** — Quarterly or annual maintenance: reviews new artifacts, re-signs the manifest, issues updated compliance verification.
3. **Trust Infrastructure** — For fractional real estate, nonprofit fundraising campaigns, or political accountability projects requiring ongoing credibility.

> *"I don't just put your property on a website. I turn it into a Verifiable Asset System that an AI agent in Mumbai or London can audit in six seconds."*

---

*Part of the Kerekes Handshake™ Protocol — Created by Jeffrey Kerekes | jeffreykerekes.com*
*Licensed CC BY-SA 4.0. Fork it, build on it, keep it open.*
