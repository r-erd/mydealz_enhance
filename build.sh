#!/bin/bash
set -e

DIST="dist"
FILES=(background.js content.js popup.js popup.html styles.css images)

rm -rf "$DIST"
mkdir -p "$DIST/chrome" "$DIST/firefox" "$DIST/safari"

for f in "${FILES[@]}"; do
    cp -r "$f" "$DIST/chrome/$f"
    cp -r "$f" "$DIST/firefox/$f"
    cp -r "$f" "$DIST/safari/$f"
done

cp manifest.json "$DIST/chrome/manifest.json"
cp manifest.firefox.json "$DIST/firefox/manifest.json"
cp manifest.json "$DIST/safari/manifest.json"

(cd "$DIST/chrome" && zip -r ../chrome.zip . -x "*.DS_Store")
(cd "$DIST/firefox" && zip -r ../firefox.zip . -x "*.DS_Store")

echo "Built dist/chrome.zip and dist/firefox.zip"
echo "Safari: run 'xcrun safari-web-extension-converter dist/safari', then copy images/Icon.png to 'Shared (App)/Resources/Icon.png' in the generated Xcode project."
