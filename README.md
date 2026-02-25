# Smart Logger

A minimal, plain HTML/CSS/JavaScript logging application for quick note-taking and log management.

## Features

- ✅ Simple, clean interface
- ✅ Add, edit, and delete logs  
- ✅ Search and filter logs
- ✅ Export/import functionality
- ✅ Auto-save to file (modern browsers)
- ✅ Responsive design
- ✅ No dependencies - works offline

## Quick Start

1. Open `index.html` in your web browser for the main interface
2. Alternatively, open `logger.html` for a simpler, lightweight version
3. Start adding logs using the input form
4. Use search to find specific logs
5. Export your data when needed

## Files

- **index.html** - Main Smart Logger interface with advanced features
- **logger.html** - Simple, lightweight logger (self-contained)
- **logger-data.json** - Sample data file
- **js/core-simple.js** - Core functionality for index.html
- **README.md** - This documentation

## Usage

### Adding Logs
- Enter an optional title and content
- Press "Add Log" or use Ctrl+Enter in the content area

### Searching
- Use the search box to find logs by title, content, or timestamp
- Clear search to show all logs

### File Operations  
- **Auto-save**: Enable to automatically save changes to a file (Chrome/Edge)
- **Load**: Import logs from a JSON file
- **Save**: Export current logs to a file
- **Export**: Choose format (JSON, Text, CSV)

### Organizing
- Sort logs by oldest/newest first
- Expand/collapse all logs at once
- Delete individual logs or clear all

## Browser Compatibility

- **Chrome/Edge**: Full functionality including auto-save to file
- **Firefox/Safari**: Core functionality (manual export/import only)
- **All modern browsers**: Basic logging, search, and localStorage persistence

## Data Storage

- Logs are automatically saved to browser localStorage
- Enable auto-save for file-based persistence
- Export regularly as backup

## License

Free to use and modify for personal and commercial purposes.
