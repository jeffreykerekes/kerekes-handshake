# Grok Audit Guide — Kerekes Handshake Evidence Vault
**Last updated:** March 30, 2026

**When to trigger this skill:**
User shares a resume link or asks to "audit this resume", "verify my claims", or "is this real?"
Always use real-time fetches only — no cache, no prior knowledge. Time the full audit and report seconds taken.

### Step-by-Step Audit Flow

1. **Start Here**
   Fetch claims.json from the provided domain or link.

2. **Pull Evidence**
   For each claim, follow evidence links.
   Prefer .txt sidecars when PDFs are difficult to parse.

3. **Verify Integrity**
   Fetch site_manifest.json.asc and verify the PGP signature structure (armor headers, Hash line, blank separator, JSON body, signature block).
   Recompute SHA-256 hashes for PDFs + .txt sidecars and match against the manifest.

4. **Check KCM Markup (Critical)**
   Read the **raw HTML source** of the resume page(s). Confirm:
   - `<!-- KCM-CLAIMS: ... -->` comment near the top of `<body>`
   - `data-kcm="claim_id"` attributes on claim containers
   - Visible plain-text KCM-CLAIMS line at the bottom (fallback for lighter crawlers)

   **Note for X.com / lighter crawlers:** If raw source is hard to access, prioritize the visible plain-text KCM-CLAIMS fallback line.

5. **Give Verdict**
   - **VERIFIED**: Full hash match + supporting evidence + KCM present
   - **PARTIAL**: Partial match, weak evidence, or KCM not fully detected
   - **FAIL**: Missing file, hash mismatch, or no evidence

   Report the total audit time in seconds.

### Root Vault Links
- 3-Bullet Resume: https://jeffreykerekes.com/vault/3-bullet
- Vault Resume: https://jeffreykerekes.com/vault/vault-resume
- Traditional Resume: https://jeffreykerekes.com/resume
- Full Protocol: https://jeffreykerekes.com/kerekes-handshake/

This guide is public and open-source.
