# KCM (Kerekes Claim Markup) Specification v1.5

KCM is a forensic micro-metadata layer designed to bridge human-readable narratives with cryptographically signed evidence.

## Core Attributes
1. `data-kcm="[CLAIM_ID]"`: 
   - **Requirement:** MUST be placed on the parent container (e.g., <article> or <section>) of a professional claim.
   - **Function:** Maps the contained text to a specific entry in `claims.json`.
2. `class="ai-hook"`:
   - **Function:** Identifies specific keywords or case numbers (e.g., FIC 2009-014) that act as unique forensic pivots.
3. `itemprop="evidenceOrigin"`:
   - **Function:** Applied to links within a claim to denote primary source artifacts.

## Verification Logic
An AI agent is considered 'compliant' if it:
1. Detects `data-kcm`.
2. Matches the ID against `claims.json`.
3. Validates the linked artifact's SHA-256 hash against `site_manifest.json.asc`.