# Compliance & Legal

## License

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0).
See the [`LICENSE`](LICENSE) file for the full license text.

## Dependency Audit

This project has **no external runtime or build dependencies**. It is implemented
entirely in vanilla JavaScript, HTML, and CSS using standard Web Extension APIs
(Manifest V3). There are no npm packages, bundled libraries, or transitive
dependencies.

The build script (`build.sh`) uses only standard POSIX utilities (`cp`, `zip`)
that are pre-installed on virtually all Unix-like systems.

## Privacy

mydealz_enhance is designed with **privacy-by-default** principles:

- **No server:** The extension runs entirely client-side in your browser. There is no backend.
- **No cookies:** We do not use cookies or any similar tracking mechanisms.
- **No analytics:** No third-party analytics, telemetry, or tracking scripts are included.
- **No external data transmission:** No data is ever sent to any external server.
- **Local storage only:** User preferences and filter keywords are stored in the browser's `chrome.storage.local`.
- **You own your data:** All data remains on your device and can be deleted at any time by removing the extension or clearing extension storage.
- **No account required:** There is no registration, login, or personal information collected.

### Data Stored in `chrome.storage.local`

| Key | Purpose | Retention |
|-----|---------|-----------|
| `keywords` | User-defined filter keywords for hiding deals | Until manually removed or extension uninstalled |
| `options` | UI preferences (hide images, greyscale mode, hide categories, etc.) | Until manually changed or extension uninstalled |
| `hideSidebar` | Sidebar visibility preference | Until manually changed or extension uninstalled |

To delete all data, remove the extension or clear extension data via your browser's settings.

## Attribution

- The extension icons (`images/icon-*.png`, `images/Icon.png`, `images/croc*.png`, `images/croc*.svg`) are original SVG artwork created by the project author, exported to PNG for use as browser extension icons.
- No external fonts, CDN resources, or third-party libraries are loaded at runtime.
- The inline SVG grayscale filter embedded in `styles.css` is a trivial, standards-based data URI and does not constitute a separate copyrighted work.

## No Impressum Required

Under German law (Telemediengesetz § 5), an **Impressum** is required for
*geschäftsmäßige Online-Dienste* (commercial online services offered in the
course of business).

mydealz_enhance is **not a commercial service**:

- It is a free, open-source personal tool distributed under GPL-3.0.
- There is no payment, no advertising, no revenue model, and no business activity.
- It is not operated in the course of a trade, business, or profession.
- There is no journalistic or editorial content.

Because the extension is **non-commercial and non-business**, the Impressum
requirement under § 5 TMG does not apply.

## Contributing

By contributing to this project, you agree that your contributions will be
licensed under the same GPL-3.0 license.
