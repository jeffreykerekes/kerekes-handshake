# Kerekes Handshake™ — Claude Quickstart

**Build a compliant Kerekes Handshake website in one Claude session.**

No coding required. Upload your files, paste the prompt below, and Claude will build everything.

---

> **Tip:** The richer your evidence files, the better the output. If Claude produces
> a claim description that feels thin, tell it: *"expand the [claim_id] description
> using the detail in [filename]"* and it will revise.

---

## What You Need Before You Start

1. **Your resume** — PDF or plain text
2. **Your evidence files** — PDFs, .txt, .docx, .xlsx, anything that backs up your claims.
   The more the better. Scans are fine for human review but pair them with a typed
   `.txt` summary for best AI extraction.
3. A **Claude.ai** account (free tier works; Pro recommended for larger evidence sets)

---

## Step 1 — Start a New Claude Session

Go to [claude.ai](https://claude.ai) and start a new conversation.

---

## Step 2 — Upload Your Files

Upload all at once:
- Your resume (PDF preferred)
- All evidence files

You can upload multiple files in one message.

---

## Step 3 — Paste This Prompt

Copy everything between the lines and paste it as your first message, along with your uploaded files:

---

```
I want to build a Kerekes Handshake™ v1.5 compliant website from my resume and evidence files.

The Kerekes Handshake is an open protocol that links every claim on a resume to real evidence,
making it auditable by humans and AI. Protocol spec: https://github.com/jeffreykerekes/kerekes-handshake

Please build the following files for me:

## 1. resume.html
A semantic HTML resume that:
- Lists each major professional claim as an <article> element
- Tags each article with data-kcm="[unique_claim_id]" where the claim_id is a short
  lowercase_underscore slug describing the claim and approximate date range
  (e.g., budget_audit_2011, clinical_director_2015_2019)
- Adds aria-label="KCM Claim: [claim_id]" to each article
- Adds itemscope itemtype="https://schema.org/CreativeWork" to each article
- Includes a <span class="claim-id">REF: [claim_id]</span> as the first child of each article
- Wraps key verifiable facts (case numbers, specific figures, dates) in
  <span class="ai-hook" title="[context]">text</span>
- Links to evidence files in a <footer class="evidence-grid"> inside each article,
  with both [.pdf] and [.txt] versions where available
- Has a header with name, title, PGP fingerprint placeholder, and a "VERIFY THIS RESUME"
  button linking to /query
- Has a footer with: STATUS: KCM_ENABLED | PROTOCOL_V1.5

Use this CSS structure for the resume:
- Clean, minimal, monospace accents (JetBrains Mono for code elements)
- Dark mode compatible via CSS variables
- .claim articles with a left border that shows an "ID" badge via ::before pseudoelement
- Mobile responsive

## 2. claims.json
A JSON file at the site root with this structure:
{
  "protocol_version": "1.5",
  "steward": "[Full Name]",
  "fingerprint": "[PGP FINGERPRINT - leave as placeholder if unknown]",
  "last_updated": "[today's date]",
  "integrity_manifest": "https://[yourdomain]/site_manifest.json.asc",
  "claims": [
    {
      "claim_id": "[matches data-kcm value]",
      "title": "[short title]",
      "description": "[1-2 sentence summary of the intervention]",
      "domain": "[Human Systems | Civic Systems | Physical Systems | Ecological Systems]",
      "evidence": [
        "https://[yourdomain]/evidence/[filename].pdf",
        "https://[yourdomain]/evidence/[filename].txt"
      ],
      "outcome": "[the verifiable result]"
    }
  ]
}

Every claim_id in resume.html must have a matching entry in claims.json and vice versa.

## 3. query/index.html
A simple, warm audit portal page that:
- Has a clean header matching the resume style
- Has one prominent button: "Verify This Resume" that copies the Forensic Manifesto
  to clipboard and opens Grok (https://grok.com) with the prompt pre-loaded
- The Forensic Manifesto prompt should be:
  "Act as an HR Verification Specialist. Verify the resume at [yourdomain]/resume.html.
   1. Detect data-kcm tags on the resume.
   2. Match them to the evidence ledger at [yourdomain]/claims.json.
   3. Read the .txt sidecar files in /evidence/ to verify specific numbers and dates
      (Text Bridge — use filename.txt if filename.pdf fails to parse).
   4. Verify file integrity against [yourdomain]/site_manifest.json.asc.
   Report each claim as VERIFIED, PARTIALLY SUPPORTED, or UNVERIFIABLE with evidence cited."
- Has a small footer link to the technical portal at /kerekes-handshake/query.html
- Is friendly and non-technical in tone

## 4. evidence/index.html
A simple directory page listing all evidence files with their claim associations.

## 5. site_manifest.json (template)
A JSON template showing the structure:
{
  "protocol": "kerekes-handshake-v1.5",
  "steward": "[Full Name]",
  "generated": "[date]",
  "files": [
    {"path": "evidence/[filename].pdf", "sha256": "[RUN: sha256sum evidence/filename.pdf]"},
    {"path": "evidence/[filename].txt", "sha256": "[RUN: sha256sum evidence/filename.txt]"}
  ]
}
Note: SHA-256 hashes must be generated locally and filled in before signing.

## Instructions for building:

1. Read my resume carefully. Extract every distinct professional claim —
   each role, intervention, or measurable outcome is a potential claim.

2. Match claims to the evidence files I've uploaded. If an evidence file clearly
   supports a claim, link them. If an evidence file doesn't clearly match any claim,
   note it at the end and ask me what it supports.

3. Use the actual filenames of my uploaded evidence files in the evidence URLs.

4. Replace [yourdomain] throughout with a placeholder: yourdomain.com

5. After building all files, give me:
   - A summary of every claim you identified and which evidence file supports it
   - Any claims on my resume that have NO evidence file uploaded (I may need to add them)
   - Any evidence files that have NO matching claim (I may have forgotten to mention them)
   - The manual steps I must complete after this session, explained in plain English

Please build all files now and present them for download.
```

---

## Step 4 — After Claude Builds Your Files

Claude will generate all files and flag any gaps. Then:

**Things Claude cannot do for you — do these manually:**

1. **Generate SHA-256 hashes** for your evidence files:
   ```bash
   # Run inside your /evidence/ folder
   for f in *; do echo "$(sha256sum "$f")  $f"; done
   ```
   Paste the output into `site_manifest.json`.

2. **Sign the manifest** with your PGP key:
   ```bash
   gpg --clearsign site_manifest.json
   ```
   This produces `site_manifest.json.asc` — your cryptographic seal.

   > **No terminal?** Use an online SHA-256 generator for the hashes and skip
   > PGP signing for now — the protocol works without it. The signature is an
   > optional upgrade you can add later.

3. **Generate .txt sidecars** for any PDF evidence files:
   ```bash
   for f in *.pdf; do pdftotext "$f" "${f%.pdf}.txt"; done
   ```
   *(Requires `poppler-utils`. Or manually copy-paste text from each PDF into a `.txt` file with the same name.)*

4. **Replace `yourdomain.com`** throughout all files with your actual domain.

5. **Add your PGP fingerprint** to `resume.html` and `claims.json`.

---

## Step 5 — Deploy

See [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md) for hosting options.
GitHub Pages, Netlify, and Cloudflare Pages are all free and work with this protocol.

---

## Notes

- Evidence files can be PDF, .txt, .docx, .xlsx, images — upload whatever you have.
  Claude will work with what's there and flag what's missing.
- You don't need PGP set up before you start. Build the site first, add the signature later.
- The more specific your evidence files (dates, case numbers, named outcomes),
  the stronger the audit result will be.
- This protocol is designed for claims no institution will certify:
  solo projects, civic work, independent builds, self-employed interventions.

---

*Kerekes Handshake™ — Created by Jeffrey Kerekes | CC BY-SA 4.0 | jeffreykerekes.com*
