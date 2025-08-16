# Go Links - Chrome Extension

A lightweight Chrome extension that lets you create and use custom shortcuts directly from your browser's address bar. Simply type `go <shortcut>` to instantly navigate to your favorite websites.

![Chrome Web Store Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🚀 **Quick Navigation**: Type `go` followed by your shortcut in the address bar
- 💾 **Easy Shortcut Management**: Save shortcuts with a single click from any page
- 🔍 **Smart Suggestions**: Get autocomplete suggestions as you type
- 🔧 **Flexible Paths**: Append paths to shortcuts (e.g., `go docs /spreadsheet`)
- 🔄 **Import/Export**: Backup and share your shortcuts
- 🎯 **Fallback Search**: Unknown shortcuts automatically search Google

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/go-links.git
   cd go-links
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the cloned directory

## Usage

### Creating Shortcuts

1. **Via Popup**: Click the extension icon and create a shortcut for the current page
2. **Via Options**: Right-click the extension icon → Options → Add shortcuts manually

### Using Shortcuts

1. Type `go` in the address bar (Chrome's omnibox)
2. Press Space
3. Type your shortcut name
4. Press Enter

### Advanced Features

- **Path Appending**: Add paths to base URLs by typing them after the shortcut
- **Smart URL Detection**: Type URLs directly after `go` to navigate without `https://`
- **Keyboard Shortcuts**: 
  - Enter: Open in current tab
  - Ctrl/Cmd + Enter: Open in new tab

## Managing Shortcuts

Access the options page by:
- Right-clicking the extension icon → Options
- Clicking "Manage Shortcuts" in the popup

From the options page, you can:
- View all your shortcuts
- Edit existing shortcuts
- Delete shortcuts
- Import/Export shortcuts as JSON
- Search through your shortcuts

## Privacy

This extension:
- Stores all data locally using Chrome's sync storage
- Does not collect any user data
- Does not make external API calls
- Requires minimal permissions (storage and tabs)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
