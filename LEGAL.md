# Kerekes Handshake™ — Legal Posture

*This document is a structural analysis of how the protocol affects legal liability. It is not legal advice. Consult an attorney for jurisdiction-specific guidance.*

---

## The Shift From Puffery to Representation

A standard resume is generally treated by courts as **puffery** — marketing claims that a reasonable person would not take as literal, guaranteed fact. Under this framework, an employer who fails to verify a resume claim bears significant responsibility for the consequences of that failure. The cost of a bad hire typically falls on the employer, not the applicant.

The Kerekes Handshake™ changes this calculus.

By PGP-signing a manifest that links specific claims to specific primary artifacts, the actor creates a **cryptographically timestamped record of deliberate representation**. This is structurally distinct from puffery in two ways:

**Intent:** You cannot accidentally PGP-sign a fabricated document. Executing a cryptographic handshake on forged evidence is, by definition, premeditated. The act of signing eliminates the "I misremembered" or "I exaggerated" defenses available to a standard resume.

**Justifiable reliance:** The stated purpose of the protocol is to make manual due diligence unnecessary — to replace the employer's verification burden with cryptographic proof. An employer who relies on a signed, evidence-anchored claim is likely to be found to have relied justifiably. This is the element that makes fraud claims actionable.

The net effect is that the protocol transforms a job applicant's professional claim from a marketing statement into something closer to a **commercial representation and warranty** — the mechanism used in business transactions where a seller asserts facts about an asset and accepts liability if those facts are false.

---

## The Asymmetry This Creates

For the honest implementer, the protocol is straightforward: gather your real evidence, link it to your claims, sign the manifest. The upfront work is real. The protection is also real — a signed, timestamped vault of primary artifacts is a strong defense if a claim is later disputed.

For a bad actor, the protocol introduces a liability trap. Fabricating evidence, mapping it in `claims.json`, generating SHA-256 hashes, and signing the manifest with a personal PGP key is a documented, traceable record of premeditated fraud. Civil liability, restitution of wages paid, and legal fees are all plausible consequences. The cryptographic record makes the intent difficult to deny.

People lie when there are no consequences. This protocol creates consequences.

---

## What This Protocol Is Not

This protocol does not create a legal affidavit. A formal affidavit requires jurisdiction-specific perjury language and, in most jurisdictions, notarization or witnessing. The Kerekes Handshake creates a contractual-style representation, not a statutory declaration.

This protocol does not guarantee that employers will have legal recourse in every jurisdiction. Employment law, fraud statutes, and the treatment of cryptographic evidence in court vary significantly by location. The structural analysis above is general. Specific situations require specific legal counsel.

---

## For Implementers

If you are building on this protocol and wish to make the legal representation explicit, consider adding a `legal_declaration` field to your `claims.json`:

```json
"legal_declaration": "The artifacts linked herein are authentic primary source documents to the best of my knowledge. I understand that PGP-signing this manifest constitutes a deliberate representation of their authenticity."
```

This is optional. Its presence strengthens the case for justifiable reliance by an auditor or employer. Its absence does not eliminate the liability implications of signing a manifest over fabricated evidence.

---

*This document is part of the Kerekes Handshake™ Protocol — Created by Jeffrey Kerekes | jeffreykerekes.com*
*Licensed CC BY-SA 4.0. Not legal advice.*
