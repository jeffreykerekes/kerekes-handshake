# Kerekes Handshake™ — Use Cases & Applications

**From Verifiable Resumes to Evidence-Anchored Claims.**

---

## The Honest Premise

**Self-certification is self-lying.**

Before describing what this protocol does, it is important to say directly what it does not do: it does not prevent fraud. A motivated actor can fabricate a PDF, sign it with PGP, and serve it with a perfect evidence vault. The signature proves *who vouched for the file* — not that the file is authentic.

Humans have been lying in professional contexts for as long as professional contexts have existed. The apostille system — the international chain used to legalize documents across borders — took **centuries to develop** because people always lied and always will. That chain requires a notary, a Secretary of State, a certified translator, and a consulate — four independent vouchers each certifying the last.

The Kerekes Handshake does not replicate that chain. What it does is **raise the cost and detectability of lying** by anchoring claims to inspectable artifacts. The goal is not a solved problem. The goal is a better signal-to-noise ratio than the current system, which has essentially no signal at all.

*This is a meaningful contribution. It is not a guarantee.*

---

## The Universal Model

The Kerekes Handshake™ applies to any domain where a claim needs evidence:

```
Actor → Claim → Artifact Vault → Verification
```

- **Actor:** A person, company, product, or organization making a claim.
- **Claim:** The specific statement being asserted.
- **Artifact Vault:** The primary, raw evidence (PDFs, permits, data, logs, recordings).
- **Verification:** A human or AI agent auditing the vault directly.

The protocol is **domain-agnostic**. The same `claims.json` structure, Text Bridge, and PGP-signed manifest that verifies a resume also verifies a plumber's license, a nonprofit's financials, or a property's condition history.

---

## The Keyword Genius Paradox

AI has made everyone a "keyword genius." When every resume, product description, and political bio is perfectly optimized, the signal-to-noise ratio drops to zero. A "Perfect 10/10" resume can be generated for anyone in seconds.

**The Handshake ignores keywords. It audits provenance.**

Keyword stuffing costs nothing and leaves no trace. Fabricating a convincing evidence vault with linked government records costs significantly more effort — and when `external_verification` links to a live `.gov` endpoint, the fabrication is automatically detectable. That asymmetry is the value.

---

## Verification Strength

Not all evidence is equal. Every claim should declare and auditors should assess its **verification strength** on a 1–10 scale:

| Score | Evidence Type | Example |
|---|---|---|
| 1–2 | Self-authored, unlinked | "I saved $3.4M" Word doc |
| 3–4 | Third-party authored, no live endpoint | Press article (PDF only) |
| 5–6 | Third-party corroborated with link | Press article + `external_verification` URL |
| 7–8 | Government record | FOI ruling, permit, inspection sign-off |
| 9 | Live government endpoint | License board lookup, congressional record |
| 10 | Live QR-verified vital record | Italy-style embedded issuer verification |

Italy's vital records — which embed a QR code linking directly to the issuing authority's verification endpoint — represent the current ceiling of document verification. The `external_verification` field in `claims.json` is the path toward that ceiling for any actor who can link to a public record.

The `verification_strength` field in v1.6 allows actors to **self-declare** their score and allows AI auditors to **independently assess** on the same scale. A gap between the two is itself a signal worth reporting.

---

## Use Cases

### 1. Professional Credentials — "Interview the Resume"

**The Problem:** AI-generated narrative has made resumes indistinguishable. Keywords are cheap; proof is expensive. The current system rewards the best writer, not the best practitioner.

**The Honest Limit:** A fabricated FOI document is theoretically possible. The mitigation: the actual FIC 2009-014 ruling exists in the Connecticut FOI Commission's public database. The `external_verification` link creates a Deterministic Collision — if the provided PDF conflicts with the public record, the Handshake fails.

**The Claim:** "Saved the city $3.4M via forensic budget reconstruction."

**The Vault:** Original budget spreadsheets, FOI rulings, council resolutions, press coverage.

**Verification strength:** 7–9 depending on whether `external_verification` links to live government endpoints.

**The Value:** Keep the resume to a clean one-page summary while an AI performs an artifact-anchored audit of 20 years of primary evidence. The resume becomes a mirror reflecting the vault.

**Reference implementation:** [jeffreykerekes.com](https://jeffreykerekes.com)

---

### 2. Trades & Local Services — "Joe the Plumber"

**The Problem:** Customers rely on easily manipulated 5-star ratings. Yelp reviews can be purchased. There is no easy way to verify that a tradesperson's license is current or their past work passed inspection.

**The Honest Limit:** A plumber can scan a forged permit. The mitigation: most states have live license lookup databases. An `external_verification` link to the state licensing board endpoint means a fabricated license scan will fail against the live record.

**The Claim:** "Certified for high-pressure gas lines and fully insured."

**The Vault:** Municipal permits, insurance certificates, time-stamped inspection photos.

**Verification strength:** 5–9 depending on whether state licensing lookup is linked.

**The Value:** A QR code on the service van links to a `/query` portal. An AI assistant can **"interview the van"** before the technician steps into your home — verifying active credentials against public records without a phone call.

> *Shift: From trusting a brand to verifying a system.*

---

### 3. Consumer Products — "The Kitchen Sink"

**The Problem:** Marketing compresses complex technical reality into simplified, unverifiable slogans. The 400-page service manual exists; the brochure ignores it.

**The Honest Limit:** A manufacturer can cherry-pick favorable test data. The mitigation: `external_verification` links to Energy Star's public database or third-party lab certifications. Fabricating a test result that doesn't match the public Energy Star record is detectable.

**The Claim:** "New Dishwasher Model X cleans 30% more efficiently."

**The Vault:** Laboratory test datasets, Energy Star raw ratings, unedited internal testing videos, the full service manual.

**Verification strength:** 6–8 when linked to independent certification databases.

**The Value:** The manufacturer anchors the brochure to the vault. Marketing is separated from evidence. No cram.

> *Shift: From marketing narrative to engineering evidence.*

---

### 4. Real Estate & Property Transparency

**The Problem:** Everyone is racing to put property deeds on the blockchain — but ownership is already recorded. What's missing is verifiable *condition history*. "New roof (2022)" is a claim. The paid invoice and permit are evidence.

**The Honest Limit:** A property owner can produce a fake invoice. The mitigation: building permits are public record in most jurisdictions. An `external_verification` link to the county building department's permit lookup creates the same Deterministic Collision as any other government record.

**The Claim:** "New roof (2022), updated HVAC, no outstanding permits."

**The Vault:** Roofing contracts, paid invoices, before/after photos, permit approvals, mechanical inspection reports.

**Verification strength:** 7–9 when linked to county permit database.

**The Value:** Each property acts as its own Actor with a `claims.json`. You don't buy the listing; you buy the vault. An investor anywhere in the world can audit the roof receipt before wiring a fractional share payment.

> *"Everyone is racing to put property deeds on the blockchain — but who is putting the new roof receipt in claims.json?"*

---

### 5. Civic & Political Accountability — "The People's Audit"

**The Problem:** Political narratives are shaped by press secretaries and selective summaries. AI has made every communications operation a "narrative genius."

**The Honest Limit:** A dossier builder can selectively choose which votes to include. The mitigation: `external_verification` links to congress.gov or state legislature records. The complete voting record is public. Cherry-picking will conflict with the full record when an auditor checks both.

**The Claim:** "A 30-year record of environmental protection."

**The Vault:** Complete roll-call voting history, original bill PDFs, donation ledgers, committee records.

**Verification strength:** 8–9 when linked to official congressional or state legislative records.

**The Value:** Independent researchers build forensic dossiers without Super PAC budgets. A voter's AI can audit a 30-year legislative record directly.

> *"The Kerekes Handshake does not replace journalism. It enhances it by providing direct access to primary artifacts."*

**Important framing:** The protocol surfaces primary artifacts. It does not interpret them. The same voting record can support different conclusions depending on context — the Handshake provides the record, not the analysis. A tool is only as neutral as its user.

---

### 6. Nonprofits & Organizational Transparency

**The Problem:** Donors give based on brand trust. Neither the trust nor the watchdog scores give direct access to the underlying financials.

**The Honest Limit:** Financial statements can be fabricated. The mitigation: nonprofits registered with the IRS are required to file Form 990 publicly. An `external_verification` link to the IRS 990 database or ProPublica Nonprofit Explorer creates a verifiable anchor that conflicts with fabricated numbers.

**The Claim:** "90% of donations go directly to the field."

**The Vault:** PGP-signed forensic audits, real-time ledger snapshots, grant disbursement records.

**Verification strength:** 7–9 when linked to public IRS 990 filings.

**The Value:** Donors audit the claim directly instead of trusting a Charity Navigator score.

---

### 7. Creative Professionals — "The Death of the Portfolio Hallucination"

**The Problem:** A design portfolio is a collection of final outputs. It proves nothing about who produced the work or how.

**The Honest Limit:** Source files can be fabricated or purchased. There is no `.gov` equivalent for creative work — verification relies on forensic analysis of the file itself rather than an external record. This use case sits at the lower end of the verification strength spectrum.

**The Claim:** "Expert in non-destructive editing and complex vector masking."

**The Vault:** The source `.psd` or `.ai` file — not the exported JPEG. The layer stack, smart objects, and mask history are the evidence.

**Verification strength:** 3–5. Higher than a resume bullet, lower than a government record.

**Extension — Audio:** Raw, unedited `.wav` stems for musicians. A specialized Audio-LLM can verify pitch and timing directly from the file, bypassing the produced YouTube video.

**Extension — Video:** Project files (`.aep`) and raw plate footage for motion designers. AI verifies keyframe complexity without watching the reel.

---

## Core Concepts

### High-Fidelity Accountability
Moving from subjective 5-star ratings to objective 5-artifact proofs. The rating is noise. The artifact is signal. The score between the two is the improvement.

### Reduced Reliance on Intermediaries
The protocol shifts trust from opaque intermediaries to transparent, inspectable evidence. It does not eliminate the need for judgment — it gives auditors better raw material to work with.

### The Universal Evidence Endpoint
Every product, person, property, and project should host a standardized `/.well-known/claims.json` endpoint. This is how real standards spread — not through mandates, but through adoption.

### Interview the Record
You don't interview the candidate — you **interview the record**. The record may be incomplete. The record may be curated. But it is more inspectable than a narrative.

### Evidence-Based Verification
The Handshake makes verification **evidence-based**, not deterministic. The math confirms who signed what and when. The auditor confirms whether the evidence is sufficient. Both steps are necessary.

### The Ice Cream Float
You aren't building the PDF reader (ice cream) or the PGP library (soda). You are engineering the system that combines them into a verifiable signal. The ingredients are open; the architecture is the invention.

---

## The Integrity Layer

The `site_manifest.json.asc` (PGP-signed SHA-256 manifest) tells the auditor:
- **Who** vouched for each artifact
- **When** the vault was sealed
- **Whether** any file has been tampered with since signing

The `external_verification` field links to third-party public records. When that record is a live endpoint — a government database, a licensing board, a vital records QR — the chain approaches apostille-level reliability. When it is a static URL, it is weaker. The `verification_strength` score reflects this honestly.

---

## Non-Resume Reference Implementations

The resume use case is the live reference implementation at [jeffreykerekes.com](https://jeffreykerekes.com). The multi-domain use cases described above — trades, real estate, nonprofits, civic accountability — follow the same Actor → Claim → Artifact Vault → Verification circuit. The technical implementation is identical; only the evidence types and domain change.

Reference implementations beyond resumes are forthcoming. If you build one, community contributions are welcome via [GitHub](https://github.com/jeffreykerekes/kerekes-handshake).

## The Consulting Opportunity

The protocol is open and free. The **implementation** is a professional service.

Many organizations have the evidence but not the architecture. The Handshake consultant:

1. **Forensic Implementation** — Extracts existing evidence, builds the vault, produces a compliant `claims.json`, PGP-signed manifest, and query portal.
2. **Seal of Integrity** — Quarterly or annual maintenance: reviews new artifacts, re-signs the manifest, issues updated compliance verification.
3. **Trust Infrastructure** — For fractional real estate, nonprofit fundraising, or political accountability projects requiring ongoing credibility.

> *"I don't just put your property on a website. I turn it into a Verifiable Asset System that an AI agent anywhere in the world can audit in six seconds — with honest disclosure of what can and cannot be independently confirmed."*

---

*Part of the Kerekes Handshake™ Protocol — Created by Jeffrey Kerekes | jeffreykerekes.com*
*Licensed CC BY-SA 4.0. Fork it, build on it, keep it open.*
