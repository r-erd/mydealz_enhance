# 🐊 mydealz_enhance

## Functionality
This is a browser extension to add some custom functionality to the mydealz website.

Functions:
- add keywords to blacklist, deals that contain these in their title will be hidden (uncased string match)
- option to reduce visual clutter by enabling custom css / other modifications
    - grayscale mode
    - hide images
    - hide categories banner

<img src="img/screenshot.jpg" alt="Chrome Extension Screenshot" width="400"/>

## Usage

This is fairly easy.
- Step 1: Download the most recent version from the releases section.
- Step 2: follow [this guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) on how to install an unpacked extension in Google Chrome. Or [this guide](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading) on how to install an unpacked extension in Microsoft Edge.

Some day I might also publish it on the Google Chrome Extension Store.

I don't give any guarantees about the functionality, possible issues, compatibility or further support of this software.
You are using the extension on your own responsibility.

## Security / Privacy

I wrote this extension with good intentions and to the best of my knowledge it does not contain any vulnerabilities or other security issues or misconfigurations. The extension has the least privileges required for it to function (activeTab, scripting, storage).
It does not send any information to any servers and stores all information locally.
It does not do any tracking whatsoever.

## Development

I never did anything related to chrome extensions before and I heavily relied on ChatGPT when I put this together - so its probably far from perfect. If you spot any issues or have suggestions for improvements feel free to open an issue (or a pull request).




