# Kerekes Handshake™ v1.5
**Turn your resume from "tell" into verifiable proof — no trust required.**

---

## What I Learned Building This

While building this, I discovered that most AI crawlers fail on binary PDFs in real-time. The solution: every evidence file exists in two formats — PDF for humans, `.txt` for machines. This is the **Text Bridge** — the core innovation of v1.5.

---

## Why I Built This

I hate writing resumes. After 15+ years self-employed, I realized that modern AI resume tools force everything into a fluffy two-page limit where every bullet is "tell, don't show."

The **Kerekes Handshake** is an open protocol that links every claim on your resume to real evidence (PDFs, audits, reports, certifications). Now recruiters or AI agents can audit your career in one click instead of taking your word for it.

---

## What It Is

A lightweight, 3-layer forensic protocol that turns any resume into an auditable system:

1. **Narrative Layer:** Your resume (HTML/PDF) tagged with `data-kcm` IDs.
2. **Registry Layer:** A `claims.json` ledger mapping IDs to evidence URIs.
3. **Integrity Layer:** A PGP-signed `site_manifest.json.asc` providing a cryptographic Root of Trust.

---

## Two Ways to Implement

### Path A — Build It Yourself
Follow the full spec and deploy manually. Start with:
- [SPEC.md](./SPEC.md) — Protocol overview and non-technical quick start
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) — Full technical reference
- [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md) — 5-minute deployment walkthrough

### Path B — Let Claude Build It For You
No coding required. Upload your resume and evidence files to Claude and paste one prompt.

→ **[CLAUDE_QUICKSTART.md](./CLAUDE_QUICKSTART.md)**

---

## Quick Start (Manual)

1. **Evidence:** Place PDFs and matching `.txt` sidecars in `/evidence/`.
2. **Manifest:** Generate a `site_manifest.json` with SHA-256 hashes and sign it with PGP.
3. **Markup:** Tag your resume claims with `<article data-kcm="claim_id">`.
4. **Audit:** Deploy the `/query/` portal to give recruiters a one-click verification interface.

---

## Sample Audit Queries

* *"Compare the claims on this resume against the artifacts in the evidence folder. Highlight any discrepancies."*
* *"Verify the '2011 Budget Audit' claim. Which specific documents support the $38k debt figure?"*
* *"Check the PGP signature of the manifest. Is the evidence vault intact and untampered?"*

---

## AI Compatibility (March 2026)

| Agent | Status | Notes |
|---|---|---|
| **Grok (X.ai)** | ✓ Fully Compatible | Best-in-class for live forensic crawls |
| **ChatGPT / Claude / Perplexity** | ✓ Compatible | Use Text Bridge `.txt` files; enable CORS |

---

## Identity Verification

This implementation is cryptographically signed by its author.

- **PGP Fingerprint:** `D39E 4ACE A4FE 3E6B 547F 58C4 6174 3446 DFA7 D48F`
- **Signed Identity Summary:** [jeffreykerekes.com/verify/summary.txt](https://jeffreykerekes.com/verify/summary.txt)
- **Public Key:** [verify/pubkey.txt](./verify/pubkey.txt)

---

## License (CC BY-SA 4.0)

You are free to use, remix, and build on this protocol. You must credit **Jeffrey Kerekes** and keep your derivatives open. No proprietary "walled gardens" allowed.

---

**Created by Jeffrey Kerekes — Systems Practitioner**
[Live Demo](https://jeffreykerekes.com) | [Protocol Spec](./SPEC.md) | [Whitepaper](./Kerekes-Handshake-Whitepaper-Spec-V1.5.pdf)
