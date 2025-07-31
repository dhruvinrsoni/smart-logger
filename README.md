
# Smart Logger

A privacy-first, offline-capable logging application built with vanilla HTML, CSS, and JavaScript. Features both a modern and classic UI, works fully offline, and is PWA-enabled. No external dependencies.


## Features

- ✅ Modern UI (index.html) and Classic UI (logger.html)
- ✅ Add, search, edit, and delete logs
- ✅ Export/import logs (JSON, Text, CSV)
- ✅ Auto-save to file (modern browsers)
- ✅ Works fully offline (PWA, Service Worker, localStorage)
- ✅ Privacy-first: all data stays local unless exported
- ✅ Responsive design for mobile and desktop
- ✅ No dependencies, no build tools
- ✅ Keyboard shortcuts, phrase suggestions, notifications
- ✅ Version switcher between UIs


## Quick Start

1. Open `index.html` for the modern UI (v2)
2. Or open `logger.html` for the classic UI (v1)
3. Add logs, search, edit, delete, and export as needed
4. Use the version switcher to toggle between UIs
5. For PWA/offline: open via `python -m http.server 8000` and install to home screen


## Files & Structure

- `index.html` — Modern UI (v2), advanced features
- `logger.html` — Classic UI (v1), lightweight
- `js/core-simple.js` — Shared core logic
- `manifest.json` — PWA configuration
- `sw.js` — Service worker for offline support
- `assets/icons/` — App icons for PWA and social
- `.github/workflows/` — GitHub Actions for CI/CD, deployment, health checks
- `README.md` — This documentation


## Usage

### Adding Logs
- Enter a title (optional) and content
- Click "Add Log" or press Ctrl+Enter

### Searching & Filtering
- Use the search box to filter logs by title, content, or timestamp
- Clear search to show all logs

### File Operations
- **Auto-save**: Enable for automatic file saving (Chrome/Edge)
- **Import**: Load logs from a JSON file
- **Export**: Save logs as JSON, Text, or CSV

### Organizing
- Sort logs by newest/oldest
- Expand/collapse all logs
- Delete individual logs or clear all


## Browser Compatibility

- **Chrome/Edge**: Full functionality (auto-save, PWA install)
- **Firefox/Safari**: Core features (manual export/import, offline)
- **All modern browsers**: Logging, search, localStorage, PWA


## Data Storage & Privacy

- Logs are saved to browser localStorage by default
- Auto-save to file is available in supported browsers
- All data remains local unless you export it
- No analytics, tracking, or cloud storage


## Progressive Web App (PWA)

- Installable on mobile/desktop ("Add to Home Screen")
- Works offline via service worker
- App icons and splash screens for all platforms

## CI/CD & Automation

- **GitHub Actions**: Automated deployment to GitHub Pages on push to `main`
- **Release workflows**: Tag-based releases, versioned deployments, and health checks
- **Health monitoring**: Scheduled checks for both UIs, with status reporting

## AI Agent & Contribution Guidelines

- See `.github/copilot-instructions.md` for AI coding standards
- Keep code minimal, clean, and privacy-first
- All features must work offline and in both UIs

## Funding & Sponsorship

- See `.github/FUNDING.yml` for ways to support the project

## License

MIT License — Free for personal and commercial use.
