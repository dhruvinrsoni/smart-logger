# 🧑‍💻 Copilot Instructions for Smart Logger

## Project Overview
Smart Logger is a simple, privacy-first logging application built with vanilla HTML, CSS, and JavaScript. No external dependencies. Features two UI versions: modern (index.html) and classic (logger.html).

## Coding Guidelines for AI Agents
- Keep code minimal, clean, and well-documented
- Use vanilla JS - no frameworks or build tools
- Maintain compatibility between both UI versions
- All features must work offline with localStorage
- Privacy-first: data stays local unless user explicitly exports
- Responsive design for mobile and desktop
- Progressive Web App (PWA) enabled

## Architecture
- `index.html`: Modern UI (v2) with enhanced features
- `logger.html`: Classic UI (v1) - simple and lightweight  
- `js/core-simple.js`: Shared functionality for modern UI
- `manifest.json`: PWA configuration
- `sw.js`: Service worker for offline support

## Developer Workflow
- Open `index.html` or `logger.html` for instant preview
- For PWA testing: `python -m http.server 8000` or similar
- Both UIs should have feature parity for core logging
- Test offline functionality and file export/import
- Deploy via GitHub Pages from `main` branch

## Key Features
- Add, search, edit, delete logs
- Export/import in JSON format
- Auto-save to file (modern browsers)
- Offline PWA support
- Version switcher between UIs
- Keyboard shortcuts: `js/keyboard-shortcuts.js`
- Phrase suggestions: `js/phrase-suggestions.js`
- Notifications: `js/notifications.js`

## References
- See `docs/README.md` for full feature list and developer quickstart.
- See `docs/DEVELOPMENT.md` for technical documentation and contribution guidelines.

---

**If unclear about a pattern, check the corresponding JS module or ask for clarification.**
