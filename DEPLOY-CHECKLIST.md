# Kerekes Handshake™ — Deploy Checklist v1.5
**Estimated Time: 5–10 minutes**

Follow these steps to deploy a "Bullshit Buster" compliant forensic resume.

## 1. Prepare Your Evidence (2 minutes)
- [ ] **Collect:** Place your primary evidence PDFs in the `/evidence/` folder.
- [ ] **Standardize:** Ensure filenames are URL-friendly (e.g., `budget_audit_2011.pdf`).
- [ ] **Step 2.1 - Generate The Text Bridge:** Run the following command in your terminal within the `/evidence/` folder to create the mandatory AI-readable sidecars:
  `for f in *.pdf; do pdftotext "$f" "${f%.pdf}.txt"; done`
  *(Requires `poppler-utils`. If on Windows/Mac without terminal access, manually save a text version of each PDF with the exact same filename.)*

## 2. Map Your Claims (3 minutes)
- [ ] **Update claims.json:** Map your unique IDs to your evidence files.
- [ ] **Verification:** Ensure every `evidence` URI in the JSON points to the PDF (the AI will automatically look for the matching .txt).
- [ ] **Hash:** Generate SHA-256 hashes for your files and update your `site_manifest.json`.

## 3. Anchor Your Identity (2 minutes)
- [ ] **Sign:** Sign your manifest using your PGP key:
  `gpg --clearsign site_manifest.json`
- [ ] **Publish:** Ensure the resulting `site_manifest.json.asc` is in your root directory.

## 4. Markup Your Resume (2 minutes)
- [ ] **Tagging:** Open your resume HTML and wrap your claims in KCM tags:
  `<span data-kcm="your_claim_id">The text of your claim here</span>`
- [ ] **Portal:** Ensure your "Audit this Resume" link points to your `/query/` or `/handshake/` portal.

## 5. Deployment & Permissions
- [ ] **CORS:** Ensure your server (Cloudflare, Netlify, or Nginx) is sending `Access-Control-Allow-Origin: *` headers for the `/evidence/` directory.
- [ ] **Test:** Open Grok or a Handshake-compliant auditor and run: 
  *"Audit the claims at [your-domain] and verify them against the PGP-signed manifest."*

---
**Status:** If the AI can read your .txt sidecars and confirm the hashes match your signed manifest, you are **v1.5 Compliant.**