# Proof of Career (PoC) Protocol v1.0
## The Kerekes Handshake Specification

---

## 1. Abstract

In 2026, hiring is broken. AI-generated resumes have made "trust-me" documents unreliable. Recruiters spend more time verifying claims than evaluating talent.

The Proof of Career (PoC) Protocol replaces trust with verifiable evidence.

It anchors every professional claim to a cryptographically signed, machine-readable vault. Using the Kerekes Handshake, LLMs and human reviewers can confirm that what a candidate says is exactly what they can prove — no hallucinations, no embellishments, no doubt.

The integrity chain is cryptographically verifiable. The AI audit that follows is as good as the AI agent's access and token budget. Both are honest improvements over the status quo.

---

## 2. Core Architecture: The PoC Vault

A PoC Vault is a decentralized, host-agnostic folder that contains three required components.

### 2.1 Claims Ledger (claims.json)

A clean JSON array of every career milestone. Each entry includes:

- `claim_id` — unique identifier
- `domain` — professional category (e.g., Civic Finance, Clinical Operations)
- `description` — concise factual summary
- `evidence_refs` — list of filenames that prove the claim
- `verification_strength` — self-declared score (1–10) with rationale; AI independently assesses the same scale

### 2.2 Evidence Sidecars

Primary source documents — PDFs of press articles, FOIA records, audited reports, inspection certificates, spreadsheets — paired with lightweight `.txt` sidecar files.

The sidecar gives the auditor exact context (e.g., "See page 14 for the $42,000 per-household liability figure") and serves as a fallback when AI agents cannot parse binary PDFs in real time. This can be created automatically with a small command line prompt.

### 2.3 Cryptographic Anchor (site_manifest.json.asc)

A signed manifest containing the SHA-256 hash of every file in the vault, signed with the steward's PGP private key. This is the tamper-evident seal.

The signature proves **who** vouched for the vault and that no file has changed since signing. It does not prove the underlying documents are authentic — that is the honest limit of self-certification (any self certification/claim).

---

## 3. The Kerekes Handshake (Verification Process)

Any verifier — AI agent, ATS, or recruiter — follows four steps. If any step fails, the submission is flagged **FAIL**.

1. **Fetch & Map** — Load `claims.json` and link each claim to its evidence files.
2. **Hash Verification** — Re-calculate SHA-256 hashes of all hosted files and compare against the manifest. Confirms no document has been altered since signing.
3. **Signature Validation** — Verify the PGP signature on the manifest against the steward's public key. Confirms the vault owner published it.
4. **Forensic Audit** — Only after steps 1–3 pass does the AI review the content. The LLM is constrained by a Forensic Auditor prompt to answer only from the verified vault. Audit quality scales with the agent's token and crawl budget.

---

## 4. Minimal Viable Integration: The 3-Bullet Front-End

Candidates submit a clean, human-readable 3-bullet resume — the format increasingly demanded by time-pressured hiring managers. At the bottom, they add two links:

> *AI-verify my claims → `claims.json` + `site_manifest.json.asc`*

Recruiters get the best of both worlds: a scannable narrative for humans and cryptographic proof for machines. The vault is infinite. The resume stays one page.

---

## 5. The Honest Position

Self-certification is self-lying. This protocol does not prevent fraud. A motivated actor can fabricate evidence and sign it with PGP. The signature proves who vouched for the files — not that the files are authentic.

What the protocol does: **raise the cost and detectability of lying.**

- Honest actors pay an upfront cost to build the vault. The protection is durable.
- Dishonest actors must fabricate primary source documents, generate matching hashes, and permanently tether their cryptographic identity to a premeditated lie — exposing themselves to civil liability and restitution of wages paid.

People lie when there are no consequences. This protocol creates consequences.

**On legal posture:** By PGP-signing a manifest that links claims to evidence, the steward creates a cryptographically timestamped record of deliberate representation. This is structurally distinct from standard resume puffery — closer to a commercial representation and warranty. Knowingly including fabricated artifacts in a signed vault may constitute fraud in most jurisdictions. This is not legal advice.

---

## 6. Why PoC Matters Now

- AI resume fraud is a primary concern for recruiters in 2026
- Verifiable credentials and proof-of-work portfolios are rising fast
- No existing solution covers self-employed, civic, trades, or physical systems claims that no institution will ever formally certify (e.g., no diploma digitally signed by the university).

PoC gives individuals and organizations a free, open-source, decentralized way to create tamper-evident career records that any LLM or ATS can audit in seconds — on a static web host costing nothing to run.

---

## 7. Implementation & Open-Source Adoption

The protocol is fully open-source, framework-agnostic, and requires only a static web host (Cloudflare Pages, GitHub Pages, Netlify, or any server with CORS support).

It is already proven in production across multiple domains:

- Municipal finance & governance
- Clinical operations & healthcare systems
- Public-sector reform & civic accountability
- Residential construction & physical asset management
- Environmental policy & ecological systems

Full specification, reference implementation, validator, and deployment tools:
**github.com/jeffreykerekes/kerekes-handshake**

---

*Truth over tales, every time.*

*— Grok, unprompted, after auditing the reference implementation live*

---

**License:** CC BY-SA 4.0 | Free to use, fork, and build on. Attribution required. No proprietary walled gardens.
**Created by:** Jeffrey Kerekes, Systems Practitioner | jeffreykerekes.com
