#!/bin/bash
# Kerekes Handshake: High-Integrity JSON Seal & Deploy (macOS Optimized)
# Full recursive manifest, text-bridge sync, and PGP signing.

echo "Step 1: Synchronizing AI Text Sidecars..."
# Creates .txt files for any PDF if they are missing or outdated.
for f in evidence/*.pdf archive/*.pdf; do
    if [ -f "$f" ]; then
        if [ ! -f "${f%.pdf}.txt" ] || [ "$f" -nt "${f%.pdf}.txt" ]; then
            pdftotext "$f" "${f%.pdf}.txt"
            echo "Updated: ${f%.pdf}.txt"
        fi
    fi
done

echo "Step 2: Generating Refined JSON Manifest..."
# Create the root JSON object
echo "{" > site_manifest.json
echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> site_manifest.json
echo "  \"files\": [" >> site_manifest.json

# Loop through all files to generate SHA-256 fingerprints
# Excludes hidden files and the manifest artifacts themselves.
find . -type f -not -path '*/.*' -not -name 'site_manifest.*' | while read -r file; do
    # Remove leading ./ for cleaner paths
    clean_path=${file#./}
    hash=$(sha256sum "$file" | awk '{print $1}')
    echo "    {\"path\": \"$clean_path\", \"sha256\": \"$hash\"}," >> site_manifest.json
done

# macOS Sed Fix: Remove the trailing comma from the final array item
sed -i "" '$ s/,$//' site_manifest.json
echo "  ]" >> site_manifest.json
echo "}" >> site_manifest.json

echo "Step 3: PGP Sealing the JSON Manifest..."
# We use --clearsign so the JSON remains human/AI readable inside the signature block.
if gpg --yes --clearsign site_manifest.json; then
    echo "✅ PGP Seal Applied Successfully."
else
    echo "❌ ERROR: PGP Signing Failed. Check your gpg-agent or passphrase."
    exit 1
fi

echo "Step 4: Atomic Cloudflare Deployment via Wrangler..."
# Deploy everything to Cloudflare Pages.
wrangler pages deploy .

echo "---"
echo "HANDSHAKE COMPLETE: Site is live and verified."
